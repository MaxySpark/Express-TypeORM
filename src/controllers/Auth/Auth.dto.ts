import { IsString, Length, IsEmail, IsUUID } from 'class-validator';

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

export class GoogleLoginDto {
    @IsString()
    idToken: string;
}

export class FacebookLoginDto {
    @IsString()
    accessToken: string;
}

export class ResetPasswordDto {
    @IsString()
    email: string;
}

export class CheckResetPasswordDto {
    @IsString()
    email: string;

    @IsUUID()
    uuid: string;

    @IsString()
    resetKey: string;
}

export class SetNewPasswordDto {
    @IsString()
    email: string;

    @IsUUID()
    uuid: string;

    @IsString()
    resetKey: string;

    @IsString()
    password: string;
}
