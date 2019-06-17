import { ConnectionOptions } from 'typeorm';

const dbConncetionOptions: ConnectionOptions = {
	type: 'mysql',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [
		__dirname + '/../db/entities/*.entity{.js,.ts}',
	],
	subscribers: [
		__dirname + '/../db/subscribers/*.subscriber{.js,.ts}',
	],
	migrations: [
		__dirname + '/../db/migrations/*{.js,.ts}',
	],
	synchronize: true,
	logging: true,
};

export default dbConncetionOptions;