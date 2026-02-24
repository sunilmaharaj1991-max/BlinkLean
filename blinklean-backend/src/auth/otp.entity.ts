import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  phone_number: string;

  @Column()
  otp_code: string;

  @Column()
  expires_at: Date;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn()
  created_at: Date;
}
