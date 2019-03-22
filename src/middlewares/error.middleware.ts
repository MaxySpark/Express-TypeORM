import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const status = error.status;
    const message = error.message;

    res.status(status)
        .send({
            status,
            message
        });
};

export default errorMiddleware;