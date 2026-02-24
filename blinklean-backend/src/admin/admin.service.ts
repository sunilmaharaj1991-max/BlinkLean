import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin, AdminRole } from './admin.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Zone } from '../zones/zones.entity';
import { Booking } from '../bookings/bookings.entity';
import { Payment } from '../payments/payments.entity';
import { Service } from '../services/services.entity';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    private jwtService: JwtService,
  ) {}

  // 1. Setup default super admin if none exists (for initialization)
  async onModuleInit() {
    const adminCount = await this.adminRepository.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const superAdmin = this.adminRepository.create({
        email: 'admin@blinklean.in',
        password_hash: hashedPassword,
        role: AdminRole.SUPER_ADMIN,
      });
      await this.adminRepository.save(superAdmin);
      this.logger.log('Default super admin created.');
    }
  }

  // ==== AUTH ====
  async login(dto: AdminLoginDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email },
    });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      admin.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'admin',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ==== ZONES ====
  async addZone(data: any) {
    const zone = this.zonesRepository.create(data);
    return this.zonesRepository.save(zone);
  }

  async updateZone(id: number, data: any) {
    await this.zonesRepository.update(id, data);
    return this.zonesRepository.findOne({ where: { id } });
  }

  async toggleZone(id: number, isActive: boolean) {
    await this.zonesRepository.update(id, { is_active: isActive });
    return { message: `Zone ${id} active status set to ${isActive}` };
  }

  async getZones() {
    return this.zonesRepository.find();
  }

  // ==== BOOKINGS ====
  async getBookings() {
    return this.bookingsRepository.find({ relations: ['user'] });
  }

  async getBookingById(id: number) {
    return this.bookingsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async updateBookingStatus(id: number, status: string) {
    await this.bookingsRepository.update(id, { status });
    return { message: `Booking ${id} status updated to ${status}` };
  }

  // ==== PAYMENTS ====
  async getPayments() {
    return this.paymentsRepository.find();
  }

  async getPaymentById(id: number) {
    return this.paymentsRepository.findOne({ where: { id } });
  }

  // ==== SERVICES ====
  async updateService(id: number, data: any) {
    await this.servicesRepository.update(id, data);
    return this.servicesRepository.findOne({ where: { id } });
  }

  async getServices() {
    return this.servicesRepository.find();
  }

  // ==== DASHBOARD ====
  async getDashboardData() {
    // Basic aggregation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookingsCount = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.created_at >= :today', { today })
      .getCount();

    const activeZonesCount = await this.zonesRepository.count({
      where: { is_active: true },
    });
    const pendingPaymentsCount = await this.paymentsRepository.count({
      where: { payment_status: 'pending' },
    });
    const completedPickupsCount = await this.bookingsRepository.count({
      where: { status: 'completed' },
    });

    return {
      today_bookings: todayBookingsCount,
      completed_pickups: completedPickupsCount,
      active_zones: activeZonesCount,
      pending_payments: pendingPaymentsCount,
      message: 'Dashboard stats fetched successfully',
    };
  }
}
