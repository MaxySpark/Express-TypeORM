import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import * as jwt from 'jsonwebtoken';
import { JwtVerifyOptions } from "../configs/jwt.config";
import AppConfig from "../configs/app.config";
import { IRequest } from "../interfaces/Request.interface";
import { JwtVerificationFailedException } from "../exceptions/Auth.exceptions";


const JwtValidationMiddleware = (req: IRequest, res: Response, next: NextFunction) => {
    try {
		const token     = req.headers.authorization.split(' ')[1];
		const decoded: any   = jwt.verify(
                            token,
                            AppConfig.JWT_SECRET,
                            JwtVerifyOptions
                        );
        req.jwtPayload    = decoded;
        console.log(req.jwtPayload);

		next();
	} catch(error) {
		throw new JwtVerificationFailedException();
	}
};

export default JwtValidationMiddleware;