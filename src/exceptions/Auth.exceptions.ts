import HttpException from './HttpException';

export class FacebookLoginFailedException extends HttpException {
    constructor() {
        super(401, 'Auth Failed. Access Token verification failed');
    }
}

export class GoogleLoginFailedException extends HttpException {
    constructor() {
        super(401, 'Auth Failed. Id Token verification failed');
    }
}

export class JwtVerificationFailedException extends HttpException {
    constructor() {
        super(401, 'JWT Token Verification Failed');
    }
}

export class LoginFailedException extends HttpException {
    constructor() {
        super(401, 'Email or Password Does not Matched');
    }
}

export class ResetPasswordLinkExpiredExcepiton extends HttpException {
    constructor() {
        super(401, `Password Reset Link is Not Valid or Expired`);
    }
}

export class UserWIthThatEmailDoesNotExistExcepiton extends HttpException {
    constructor(email: string) {
        super(404, `User with email ${email} does not exist`);
    }
}

export class UserWithThatEmailExistException extends HttpException {
    constructor(email: string) {
        super(409, `User with email ${email} already exists`);
    }
}