import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles.decorator';
import { AdminRole } from './admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto);
  }

  // ==== ZONES ====
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @Post('zones/add')
  addZone(@Body() data: any) {
    return this.adminService.addZone(data);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @Put('zones/update/:id')
  updateZone(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateZone(id, data);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER)
  @Patch('zones/toggle/:id')
  toggleZone(@Param('id') id: number, @Body('is_active') isActive: boolean) {
    return this.adminService.toggleZone(id, isActive);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(
    AdminRole.SUPER_ADMIN,
    AdminRole.OPERATIONS_MANAGER,
    AdminRole.SUPPORT_STAFF,
  )
  @Get('zones')
  getZones() {
    return this.adminService.getZones();
  }

  // ==== BOOKINGS ====
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(
    AdminRole.SUPER_ADMIN,
    AdminRole.OPERATIONS_MANAGER,
    AdminRole.SUPPORT_STAFF,
  )
  @Get('bookings')
  getBookings() {
    return this.adminService.getBookings();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(
    AdminRole.SUPER_ADMIN,
    AdminRole.OPERATIONS_MANAGER,
    AdminRole.SUPPORT_STAFF,
  )
  @Get('bookings/:id')
  getBooking(@Param('id') id: number) {
    return this.adminService.getBookingById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER)
  @Patch('bookings/status/:id')
  updateBookingStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.adminService.updateBookingStatus(id, status);
  }

  // ==== PAYMENTS ====
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER)
  @Get('payments')
  getPayments() {
    return this.adminService.getPayments();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER)
  @Get('payments/:id')
  getPaymentById(@Param('id') id: number) {
    return this.adminService.getPaymentById(id);
  }

  // ==== SERVICES ====
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @Patch('services/update/:id')
  updateService(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateService(id, data);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER)
  @Get('services')
  getServices() {
    return this.adminService.getServices();
  }

  // ==== DASHBOARD ====
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER)
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardData();
  }
}
