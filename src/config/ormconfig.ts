import { ConnectionOptions } from 'typeorm';
 
const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [
    __dirname + '/../db/entities/*.entity.js',
  ],
  subscribers: [
    __dirname + '/../db/subscribers/*.subscriber.js',
  ],
  migrations: [
    __dirname + '/../db/migrations/*.js',
  ],
  synchronize: true,
  logging: true,
};
 
export default ormconfig;