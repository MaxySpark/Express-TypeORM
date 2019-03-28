import HttpException from './HttpException';

class GoogleLoginFailedException extends HttpException {
    constructor() {
        super(401, 'Auth Failed. Id Token verification failed');
    }
}

export default GoogleLoginFailedException;