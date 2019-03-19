import RouterClass from "./interfaces/routes.interface";

import UserRoutes from "./user/user.routes";

const routers: RouterClass[] = [
    new UserRoutes('/user'),
];

export default routers;
