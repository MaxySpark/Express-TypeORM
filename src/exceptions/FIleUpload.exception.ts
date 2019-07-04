import HttpException from './HttpException';

export class UnsupportedFileTypeException extends HttpException {
    constructor() {
        super(400, 'Unsupported File Type');
    }
}