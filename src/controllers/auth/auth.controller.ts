import { Request, Response, NextFunction } from 'express';
import { RegisterDto, LoginDto, GoogleLoginDto, FacebookLoginDto } from './auth.dto';
import AuthService from './auth.service';
import ServerErrorException from '../../exceptions/ServerErrorException';
import { Mail } from '../../utils/Mail.util';

class AuthController {
    private authService = new AuthService();

    constructor() { }

    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: RegisterDto = req.body;

            const auth_token = await this.authService.register(userData);

            // mail demo
            const mail = new Mail();
            mail.mailOptions.to = userData.email;
            mail.mailOptions.subject = 'Express TypeORM';
            mail.mailOptions.text = 'Registration Successful';
            mail.send();

            return res.status(201).send({
                AuthToken : auth_token
            });
            
        } catch (error) {
            console.log(error);
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
            next(error);
        }

    }

    public googleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: GoogleLoginDto = req.body;
            const auth_token = await this.authService.googleOauth(userData);

            return res.status(200).send({
                AuthToken : auth_token
            });
            
        } catch (error) {
            next(error);
        }

    }

    public facebookLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: FacebookLoginDto = req.body;
            const auth_token = await this.authService.facebookLogin(userData);

            return res.status(200).send({
                data : auth_token
            });
            
        } catch (error) {
            next(error);
        }

    }

}

export default AuthController;