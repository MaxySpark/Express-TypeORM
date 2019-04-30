import HttpException from './HttpException';

class JwtVerificationFailedException extends HttpException {
    constructor() {
        super(401, 'JWT Token Verification Failed');
    }
}

export default JwtVerificationFailedException;