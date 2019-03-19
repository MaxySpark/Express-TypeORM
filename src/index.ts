import App from './App'
import routers from './app.routes';

const port: number = Number(process.env.PORT) || 3000

const app = new App(
  routers,
  port,
);
 
app.listen();