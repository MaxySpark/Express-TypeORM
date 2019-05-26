import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp, UpdateDateColumn } from 'typeorm';

@Entity()
export class ResetPassword {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    uuid: string;

    @Column({
        default: false
    })
    reset: boolean;

    @Column()
    reset_key: string;

    @Column({
        default: false
    })
    expired: boolean;

    @CreateDateColumn()
    createdAt: Timestamp

    @UpdateDateColumn()
    updatedAt: Timestamp
}