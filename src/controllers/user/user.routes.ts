import { Router } from 'express';
import UserController from './user.controller';
import RouterClass from '../../interfaces/routes.interface';

class UserRoutes implements RouterClass {
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