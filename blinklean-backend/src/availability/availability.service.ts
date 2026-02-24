import {
  Injectable,
  Inject,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

export interface AIResponse {
  serviceable: boolean;
  allowed_services: string[];
  restriction_rules: string[];
  advisory_message: string;
  nearest_zone?: string;
}

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);

  // Set fallback AI Microservice URL (can be read from env in prod)
  private readonly aiServiceUrl =
    process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  async checkAvailability(dto: CheckAvailabilityDto): Promise<AIResponse> {
    let { latitude, longitude, address, pincode } = dto;

    if (!latitude || !longitude) {
      if (!address && !pincode) {
        throw new BadRequestException(
          'Provide either coordinates, address, or pincode.',
        );
      }

      // Future: Integrate Google Maps Geocoding here to extract exact lat/long
      // For now, mockup basic logic assuming 12.9716, 77.5946 for Bengaluru center
      // when no exact lat long is matched
      // Usually would be:
      // const coords = await this.geocodeAddress(address || pincode);
      latitude = 12.965;
      longitude = 77.525; // default dummy coordinate falling in Chandra Layout roughly
    }

    const cacheKey = `availability_${latitude}_${longitude}_${pincode}`;
    const cachedResponse = await this.cacheManager.get<AIResponse>(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post<AIResponse>(
          `${this.aiServiceUrl}/ai/check-availability`,
          {
            latitude,
            longitude,
            pincode,
          },
        ),
      );

      const aiData = response.data;

      // Cache the valid response for performance (10 mins)
      await this.cacheManager.set(cacheKey, aiData, 600);

      return aiData;
    } catch (error) {
      this.logger.error(
        'Error fetching availability from AI service',
        error.message,
      );

      // Fallback response inside the service logic if AI is down
      return {
        serviceable: false,
        allowed_services: [],
        restriction_rules: ['AI fallback timeout'],
        advisory_message: 'BlinkLean services are launching soon in your area.',
      };
    }
  }
}
