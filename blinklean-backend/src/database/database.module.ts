import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        const config: any = {
          autoLoadEntities: true,
          synchronize: true,
        };

        if (dbUrl) {
          console.log('DATABASE_URL found. Connecting to PostgreSQL...');
          config.type = 'postgres';
          config.url = dbUrl;
          config.ssl = { rejectUnauthorized: false };
        } else {
          console.log('DATABASE_URL not found. Falling back to SQLite...');
          config.type = 'sqlite';
          config.database = 'blinklean.sqlite';
        }

        return config;
      },
    }),
  ],
})
export class DatabaseModule { }
