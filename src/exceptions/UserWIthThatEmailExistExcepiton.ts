import HttpException from './HttpException';

class UserWithThatEmailExistException extends HttpException {
    constructor(email: string) {
        super(409, `User with email ${email} already exists`);
    }
}

export default UserWithThatEmailExistException;