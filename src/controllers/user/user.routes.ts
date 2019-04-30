import { Router } from 'express';
import UserController from './user.controller';
import { IRouter } from '../../interfaces/Router.interface';

class UserRoutes implements IRouter {
    public path: string;
    public router: Router = Router();
    
    constructor(path: string) {
        this.path = path;
        this.initializeRoutes(new UserController());
    }

    private initializeRoutes(controller: UserController) {
        this.router.post('/getactiveuser', controller.getActiveUser);
    }

}

export default UserRoutes;