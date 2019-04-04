import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp, UpdateDateColumn } from 'typeorm';

@Entity()
export class Mail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    messageId: string;

    @Column()
    recipient: string;

    @CreateDateColumn()
    createdAt: Timestamp

    @UpdateDateColumn()
    updatedAt: Timestamp
}