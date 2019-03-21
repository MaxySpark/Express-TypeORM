import { Router } from 'express';
import AuthController from './auth.controller';
import RouterClass from '../interfaces/routes.interface';

class AuthRoutes implements RouterClass {
    public path: string;
    public router: Router = Router();
    
    constructor(path: string) {
        this.path = path;
        this.initializeRoutes(new AuthController());
    }

    private initializeRoutes(controller: AuthController) {
        this.router.post('/register', controller.registerUser);
    }

}

export default AuthRoutes;