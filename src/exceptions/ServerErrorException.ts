import HttpException from './HttpException';

class ServerErrorException extends HttpException {
    constructor() {
        super(500, 'Internal Server Error');
    }
}

export default ServerErrorException;