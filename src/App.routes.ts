import { IRouter } from "./interfaces/Router.interface";

import UserRoutes from "./controllers/user/user.routes";
import AuthRoutes from "./controllers/auth/auth.routes";

export const getRoutes = () => {
    const routers: IRouter[] = [
        new UserRoutes('/user'),
        new AuthRoutes('/auth')
    ];
    
    return routers;
} 
