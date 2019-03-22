import * as express from 'express';
import RouterClass from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';

class App {
    public app: express.Application;
    public port: number;

    constructor(routers: RouterClass[], port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRouters(routers);
        this.initialiseErrorHandler();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
    }

    private initializeRouters(routers: RouterClass[]) {
        routers.forEach((router: RouterClass) => {
            this.app.use(router.path, router.router);
          });
    }

    private initialiseErrorHandler() {
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(this.port, (err: any) => {
            if (err) {
                return console.error('Unable to Start the Server', err);
            }
            console.log('Server is running at port : ', this.port);
        });
    }
}

export default App;