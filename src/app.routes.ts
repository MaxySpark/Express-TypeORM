import RouterClass from "./interfaces/routes.interface";

import UserRoutes from "./user/user.routes";

export const getRoutes = () => {
    const routers: RouterClass[] = [
        new UserRoutes('/user'),
    ];
    
    return routers;
} 
