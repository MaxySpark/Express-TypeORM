import * as express from 'express';
import { IRouter } from './interfaces/Router.interface';
import errorHandlerMiddleware from './middlewares/ErrorHandler.middleware';
import * as morgan from 'morgan';
import logger from './configs/winston.config';

class App {
    public app: express.Application;
    public port: number;

    constructor(routers: IRouter[], port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRouters(routers);
        this.initialiseErrorHandler();
    }

    private initializeMiddlewares() {
        this.app.use(morgan('combined', {
            stream: {
                write: (meta: any) => {
                    logger.info(meta);
                }
            }
        }));
        this.app.use(express.json());
    }

    private initializeRouters(routers: IRouter[]) {
        routers.forEach((router: IRouter) => {
            this.app.use(router.path, router.router);
        });
    }

    private initialiseErrorHandler() {
        this.app.use(errorHandlerMiddleware);
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