import { Request, Response, NextFunction } from 'express';
import { RegisterDto } from './auth.dto';
import AuthService from './auth.service';

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
            console.log(error);
            next(error);
        }

    }

}

export default AuthController;