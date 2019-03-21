import { IsString, Length, IsBoolean, IsEmail } from 'class-validator';

export class RegisterDto {

    @IsEmail()
    email: string;

    @IsString()
    @Length(1,30)
    firstname: string;

    @IsString()
    @Length(1,30)
    lastname: string;

    @IsString()
    @Length(3,15)
    username: string;

    @IsString()
    @Length(6,20)
    password: string;
}

export class LoginDto {

    @IsEmail()
    email: string;

    @IsString()
    @Length(6,20)
    password: string;
}
