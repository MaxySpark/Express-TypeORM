import 'dotenv/config';
import App from './App'
import routers from './app.routes';
import { createConnection } from 'typeorm';
import ormconfig from './config/ormconfig';

const port: number = Number(process.env.PORT) || 3000;

(async () => {
    try {
      await createConnection(ormconfig);
    } catch (error) {
      console.log('Error while connecting to the database', error);
      return error;
    }
    const app = new App(
        routers,
        port,
      );
    app.listen();
  })();