const AppConfig = {
    JWT_PRIVATE_KEY : process.env.JWT_PRIVATE_KEY,
    JWT_PUBLIC_KEY : process.env.JWT_PUBLIC_KEY,
    JWT_SECRET : process.env.JWT_SECRET,
    APP_PORT : Number(process.env.APP_PORT) || 3000 
}
export default AppConfig;