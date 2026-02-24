import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config: any = {
          autoLoadEntities: true,
          synchronize: true, // Auto-migration (be careful in production)
        };

        if (process.env.DATABASE_URL) {
          console.log('Connecting to PostgreSQL database...');
          config.type = 'postgres';
          config.url = process.env.DATABASE_URL;
          config.ssl = { rejectUnauthorized: false };
        } else {
          console.log('DATABASE_URL not found, falling back to local SQLite...');
          config.type = 'sqlite';
          config.database = 'blinklean.sqlite';
        }

        return config;
      },
    }),
  ],
})
export class DatabaseModule { }
