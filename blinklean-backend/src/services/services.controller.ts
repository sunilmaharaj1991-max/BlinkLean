import {
  Controller,
  Get,
  Headers,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { GetServicesDto } from './dto/get-services.dto';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  getServices(
    @Headers('platform') platform: string,
    @Query() dto: GetServicesDto,
  ) {
    if (!platform) {
      throw new BadRequestException('platform header is required (web or app)');
    }
    return this.servicesService.getServices(platform, dto.pincode);
  }
}
