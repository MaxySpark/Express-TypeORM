import {Entity, PrimaryGeneratedColumn, Column,  Generated, CreateDateColumn, UpdateDateColumn, Timestamp} from "typeorm";

@Entity({
    name: 'users'
})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    @Generated("uuid")
    uuid: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({
        default: false
    })
    active: boolean;

    @CreateDateColumn()
    createdAt: Timestamp

    @UpdateDateColumn()
    updatedAt: Timestamp
}
