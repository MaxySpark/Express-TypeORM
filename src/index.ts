import 'dotenv/config';
import App from './App'
import  { getRoutes }  from './app.routes';
import { createConnection } from 'typeorm';
import dbConncetionOptions from './config/orm.config';

const port: number = Number(process.env.PORT) || 3000;

(async () => {
    try {
       await createConnection(dbConncetionOptions);
    } catch (error) {
      console.log('Error while connecting to the database', error);
      return error;
    }
    const app = new App(
      getRoutes(),
      port,
    );
    app.listen();

  })();