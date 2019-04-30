import RouterClass from "./interfaces/routes.interface";

import UserRoutes from "./controllers/user/user.routes";
import AuthRoutes from "./controllers/auth/auth.routes";

export const getRoutes = () => {
    const routers: RouterClass[] = [
        new UserRoutes('/user'),
        new AuthRoutes('/auth')
    ];
    
    return routers;
} 
