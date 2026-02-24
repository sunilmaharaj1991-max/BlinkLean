import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  pickup_address: string;

  @Index()
  @Column()
  pincode: string;

  @Column('json', { nullable: true })
  selected_materials: any; // Storing array of items

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimated_weight: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  predicted_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  final_weight: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  final_payout_amount: number;

  @Column({ default: 'pending' })
  payment_status: string; // pending, completed

  @Column()
  pickup_date: string;

  @Column()
  status: string; // scheduled, completed, cancelled

  @CreateDateColumn()
  created_at: Date;
}
