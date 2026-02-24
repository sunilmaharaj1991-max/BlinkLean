import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ScrapBookingStatus {
    PENDING = 'PENDING',
    PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
    COLLECTED = 'COLLECTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Entity('scrap_bookings')
export class ScrapBooking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_name: string;

    @Column()
    phone_number: string;

    @Column('text')
    address: string;

    @Column()
    pincode: string;

    @Column('simple-json')
    items: Array<{ material_name: string; estimated_weight: number }>;

    @Column({
        type: 'varchar',
        default: ScrapBookingStatus.PENDING,
    })
    status: ScrapBookingStatus;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    final_value: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
