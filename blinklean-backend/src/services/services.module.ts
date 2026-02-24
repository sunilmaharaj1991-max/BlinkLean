import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './services.entity';
import { Zone } from '../zones/zones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Zone])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
