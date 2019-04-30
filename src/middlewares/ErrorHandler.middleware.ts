import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import logger from '../configs/winston.config';

const errorHandlerMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'SOmething Went Wrong';

    logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(status)
        .send({
            status,
            message
        });
};

export default errorHandlerMiddleware;