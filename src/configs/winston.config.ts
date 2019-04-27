import * as winston from 'winston';
import * as appRoot from 'app-root-path';
import * as stream from 'stream';

const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = winston.createLogger({
    transports : [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError : false
});


// logger.stream = (options?: any) => new stream.Duplex({
//     write: (message: string, encoding: any) => { logger.info(message); }
// })

export default logger;