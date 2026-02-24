import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

export enum AdminRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    OPERATIONS_MANAGER = 'OPERATIONS_MANAGER',
    SUPPORT_STAFF = 'SUPPORT_STAFF',
}

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @Column({
        type: 'varchar',
        default: AdminRole.SUPPORT_STAFF,
    })
    role: AdminRole;

    @CreateDateColumn()
    created_at: Date;
}
