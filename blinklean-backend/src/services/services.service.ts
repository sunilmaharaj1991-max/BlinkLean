import {
  Injectable,
  Inject,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Service } from './services.entity';
import { Zone } from '../zones/zones.entity';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getServices(platform: string, pincode?: string) {
    if (!platform || !['web', 'app'].includes(platform.toLowerCase())) {
      throw new BadRequestException(
        'Invalid platform header. Must be web or app',
      );
    }

    const platformMode = platform.toLowerCase();
    const cacheKey = `services_${platformMode}_${pincode || 'all'}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // Check pincode logic
    let scrapeServiceActive = true;
    let cleaningActive = true;
    let vehicleActive = true;
    let laundryActive = true;
    let zoneActive = true;

    if (pincode) {
      const zone = await this.zonesRepository.findOne({
        where: { pincode, is_active: true },
      });
      if (!zone) {
        zoneActive = false;
        scrapeServiceActive = false;
        cleaningActive = false;
        vehicleActive = false;
        laundryActive = false;
      } else {
        scrapeServiceActive = zone.scrap_service_available;
        cleaningActive = zone.cleaning_service_available;
        vehicleActive = zone.vehicle_service_available;
        laundryActive = zone.laundry_service_available;
      }
    }

    const services = await this.servicesRepository.find();

    const result = services.map((service) => {
      let bookingEnabled = false;
      let message = '';

      const isScrap =
        service.category.toLowerCase().includes('scrap') ||
        service.category.toLowerCase().includes('recycling');

      if (isScrap) {
        if (!scrapeServiceActive && pincode) {
          bookingEnabled = false;
          message = 'Launching soon in your area';
        } else {
          bookingEnabled = true;
          message = 'Scrap pickup available in your area';
        }
      } else {
        // App-only services like cleaning, vehicle, laundry
        if (platformMode === 'web' || service.app_only) {
          if (platformMode === 'web') {
            bookingEnabled = false;
            message = 'Available via BlinkLean App';
          } else {
            // Mobile app logic
            if (!zoneActive && pincode) {
              bookingEnabled = false;
              message = 'Launching soon in your area';
            } else {
              bookingEnabled = true;
            }
          }
        }
      }

      // Explicit fail safe overriding
      if (bookingEnabled === false) {
        this.logger.debug(
          `Booking disabled for ${service.name} on ${platformMode}`,
        );
      }

      return {
        id: service.id,
        name: service.name,
        category: service.category,
        description: service.description,
        booking_enabled: bookingEnabled,
        app_only: service.app_only,
        message: message || undefined,
      };
    });

    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }
}
