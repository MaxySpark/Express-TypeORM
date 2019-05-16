import 'dotenv/config';
import App from './App'
import  { getRoutes }  from './App.routes';
import { createConnection } from 'typeorm';
import dbConncetionOptions from './configs/orm.config';
import AppConfig from './configs/app.config';

(async () => {
    try {
       await createConnection(dbConncetionOptions);
    } catch (error) {
      console.log('Error while connecting to the database', error);
      return error;
    }
    const app = new App(
      getRoutes(),
      AppConfig.APP_PORT,
    );
    app.listen();

  })();