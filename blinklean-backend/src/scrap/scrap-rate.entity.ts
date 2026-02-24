import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity()
export class ScrapRate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    material_name: string; // e.g., 'newspapers', 'cardboard', 'mixed scrap'

    @Column('decimal', { precision: 10, scale: 2 })
    rate_per_kg: number;

    @Column({ default: true })
    is_active: boolean;

    @UpdateDateColumn()
    last_updated: Date;
}
