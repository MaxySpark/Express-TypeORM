import { Request, Response, NextFunction } from 'express';
import { RegisterDto, LoginDto } from './auth.dto';
import AuthService from './auth.service';
import ServerErrorException from '../../exceptions/ServerErrorException';

class AuthController {
    private authService = new AuthService();

    constructor() { }

    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: RegisterDto = req.body;

            const auth_token = await this.authService.register(userData);

            return res.status(201).send({
                AuthToken : auth_token
            });
            
        } catch (error) {
            next(error);
        }

    }

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: LoginDto = req.body;
            const auth_token = await this.authService.login(userData);

            return res.status(200).send({
                AuthToken : auth_token
            });
            
        } catch (error) {
            console.log(error);
            next(error);
        }

    }

}

export default AuthController;