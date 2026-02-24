import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');
import { Payment } from './payments.entity';
import { Booking } from '../bookings/bookings.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: any;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
    });
  }

  async createOrder(phone: string, dto: CreateOrderDto) {
    const booking = await this.bookingsRepository.findOne({
      where: { id: dto.booking_id },
      relations: ['user'],
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    if (booking.user.phone_number !== phone) {
      throw new BadRequestException('Payment unauthorized for this booking');
    }

    if (booking.status === 'PAID') {
      throw new BadRequestException(
        'Payment already completed for this booking',
      );
    }

    // Usually derived from pricing logic, fixed 199 for scrap test
    const amount = 199;

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${booking.id}_${Date.now()}`,
    };

    try {
      const order = await this.razorpay.orders.create(options);

      // Record pending payment
      const payment = this.paymentsRepository.create({
        booking_id: booking.id,
        amount: amount,
        payment_status: 'pending',
        payment_gateway: 'razorpay',
        transaction_reference: order.id,
      });
      await this.paymentsRepository.save(payment);

      return {
        order_id: order.id,
        amount: order.amount,
        payment_key: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
      };
    } catch (error) {
      this.logger.error('Razorpay order creation failed', error);
      throw new BadRequestException('Failed to create payment order');
    }
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = dto;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      throw new BadRequestException('Payment signature verification failed');
    }

    // Success flow - update models via pseudo-transaction
    const payment = await this.paymentsRepository.findOne({
      where: { transaction_reference: razorpay_order_id },
    });
    if (!payment) {
      throw new BadRequestException('Payment order not found in system');
    }

    if (payment.payment_status === 'success') {
      throw new BadRequestException('Payment already verified');
    }

    payment.payment_status = 'success';
    await this.paymentsRepository.save(payment);

    const booking = await this.bookingsRepository.findOne({
      where: { id: payment.booking_id },
    });
    if (booking) {
      booking.status = 'PAID';
      await this.bookingsRepository.save(booking);
    }

    return { status: 'Payment successful. Your pickup is confirmed.' };
  }
}
