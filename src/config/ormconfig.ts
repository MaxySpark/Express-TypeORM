import { ConnectionOptions } from 'typeorm';
 
const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.PMYSQL_PORT),
  username: process.env.PMYSQL_USER,
  password: process.env.PMYSQL_PASSWORD,
  database: process.env.PMYSQL_DB,
  entities: [
    __dirname + '/../dist/db/entity/*.js',
  ],
  synchronize: true,
};
 
export default ormconfig;