import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { Length } from 'class-validator';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    @Length(0,12)
    username: string;

    @Column()
    password: string;

    @Column({
        default: false
    })
    active: boolean;
}
