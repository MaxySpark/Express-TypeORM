import HttpException from './HttpException';

class FacebookLoginFailedException extends HttpException {
    constructor() {
        super(401, 'Auth Failed. Access Token verification failed');
    }
}

export default FacebookLoginFailedException;