import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapController } from './scrap.controller';
import { ScrapService } from './scrap.service';
import { ScrapRate } from './scrap-rate.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ScrapRate])],
    controllers: [ScrapController],
    providers: [ScrapService],
    exports: [ScrapService],
})
export class ScrapModule { }
