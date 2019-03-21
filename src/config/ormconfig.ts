import { ConnectionOptions } from 'typeorm';
 
const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [
    __dirname + '/../db/entity/*.entity.js',
  ],
  synchronize: true,
  logging: true,
};
 
export default ormconfig;