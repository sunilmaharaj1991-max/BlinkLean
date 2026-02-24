import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class Zone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city_name: string;

  @Column()
  area_name: string;

  @Index()
  @Column()
  pincode: string;

  @Column({ default: true })
  scrap_service_available: boolean;

  @Column({ default: false })
  cleaning_service_available: boolean;

  @Column({ default: false })
  vehicle_service_available: boolean;

  @Column({ default: false })
  laundry_service_available: boolean;

  @Column({ default: true })
  is_active: boolean;
}
