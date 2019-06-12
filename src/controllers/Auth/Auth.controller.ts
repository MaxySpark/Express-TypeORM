import { Request, Response, NextFunction } from 'express';
import { RegisterDto, LoginDto, GoogleLoginDto, FacebookLoginDto, ResetPasswordDto, CheckResetPasswordDto, SetNewPasswordDto } from './Auth.dto';
import AuthService from './Auth.service';
import { Mail } from '../../utils/Mail.util';
import { responseWrapper } from '../../utils/ResponseWrapper.util';

class AuthController {
    private authService = new AuthService();

    constructor() { }

    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: RegisterDto = req.body;

            const auth_token = await this.authService.register(userData);

            const mail = new Mail();
            mail.mailOptions.to = userData.email;
            mail.send('register', { name: userData.firstname});
            
            return responseWrapper(res, {
                status: 201,
                message: 'Registration Was Successful',
                data: {
                    AuthToken : auth_token
                }
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

            return responseWrapper(res, {
                message: 'Login Was Successful',
                data: {
                    AuthToken : auth_token
                }
            });
            
        } catch (error) {
            next(error);
        }

    }

    public googleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: GoogleLoginDto = req.body;
            const auth_token = await this.authService.googleOauth(userData);

            return responseWrapper(res, {
                message: 'Login Was Successful',
                data: {
                    AuthToken : auth_token
                }
            });
            
        } catch (error) {
            next(error);
        }

    }

    public facebookLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: FacebookLoginDto = req.body;
            const auth_token = await this.authService.facebookLogin(userData);

            return responseWrapper(res, {
                message: 'Login Was Successful',
                data: {
                    AuthToken : auth_token
                }
            });
            
        } catch (error) {
            next(error);
        }

    }

    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: ResetPasswordDto = req.body;
            await this.authService.resetPassword(userData);

            return responseWrapper(res, {
                message: 'Password Reset Link Has Been Sent',
            });
            
        } catch (error) {
            next(error);
        }

    }

    public checkResetPasswordRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CheckResetPasswordDto = req.body;
            const reset_data = await this.authService.checkResetPasswordRequest(userData);

            return responseWrapper(res, {
                message: 'Password Reset Link is Valid',
                data: reset_data
            });
            
        } catch (error) {
            next(error);
        }

    }

    public setNewPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: SetNewPasswordDto = req.body;
            const reset_data = await this.authService.setnewPassword(userData);

            return responseWrapper(res, {
                message: 'Password Has Been Reset Successfully',
                data: reset_data
            });
            
        } catch (error) {
            next(error);
        }

    }

}

export default AuthController;
