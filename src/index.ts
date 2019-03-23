import 'dotenv/config';
import App from './App'
import  { getRoutes }  from './app.routes';
import { createConnection } from 'typeorm';
import dbConncetionOptions from './configs/orm.config';
import appconfig from './configs/app.config';

(async () => {
    try {
       await createConnection(dbConncetionOptions);
    } catch (error) {
      console.log('Error while connecting to the database', error);
      return error;
    }
    const app = new App(
      getRoutes(),
      appconfig.APP_PORT,
    );
    app.listen();

  })();