import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  async createOrder(
    @Req() req,
    @Headers('platform') platform: string,
    @Body() dto: CreateOrderDto,
  ) {
    if (!platform || platform.toLowerCase() !== 'app') {
      throw new BadRequestException(
        'Payments are currently disabled on web. Secure payment available in the BlinkLean mobile app.',
      );
    }
    return this.paymentsService.createOrder(req.user.phone, dto);
  }

  @Post('verify')
  async verifyPayment(
    @Headers('platform') platform: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    if (!platform || platform.toLowerCase() !== 'app') {
      throw new BadRequestException(
        'Platform execution bypass blocked. Access via app.',
      );
    }
    return this.paymentsService.verifyPayment(dto);
  }
}
