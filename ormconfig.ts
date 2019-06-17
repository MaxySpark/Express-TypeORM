module.exports = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        'src/db/entities/*.entity{.js,.ts}',
    ],
    migrations: [
        'src/db/migrations/*{.js,.ts}'
    ],
    cli: {
        entitiesDir: 'src/db/entities',
        migrationsDir: 'src/db/migrations',
        subscribersDir: 'src/db/subscribers'
    }
}