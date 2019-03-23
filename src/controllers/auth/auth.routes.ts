import { Router } from 'express';
import AuthController from './auth.controller';
import RouterClass from '../../interfaces/routes.interface';
import validationMiddleware from '../../middlewares/dtovalidation.middleware';
import { RegisterDto } from './auth.dto';

class AuthRoutes implements RouterClass {
    public path: string;
    public router: Router = Router();
    
    constructor(path: string) {
        this.path = path;
        this.initializeRoutes(new AuthController());
    }

    private initializeRoutes(controller: AuthController) {
        this.router.post('/register', validationMiddleware(RegisterDto), controller.registerUser);
    }

}

export default AuthRoutes;