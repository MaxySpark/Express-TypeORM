import HttpException from './HttpException';

class LoginFailedException extends HttpException {
    constructor() {
        super(401, 'Email or Password Does not Matched');
    }
}

export default LoginFailedException;