import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  booking_id: number;

  @Column()
  amount: number;

  @Column()
  payment_status: string; // pending, success, failed

  @Column()
  payment_gateway: string;

  @Column()
  transaction_reference: string;

  @CreateDateColumn()
  created_at: Date;
}
