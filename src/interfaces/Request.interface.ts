import { Request } from 'express';
import { IJwtPayload } from './JwtPayload.interface';

export interface IRequest extends Request {
    jwtPayload?: IJwtPayload;
}