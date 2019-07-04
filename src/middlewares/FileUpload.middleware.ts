import { Response, NextFunction } from 'express';
import { IRequest } from '../interfaces/Request.interface';
import { FileUpload } from '../utils/FileUpload.util';

export const DemoImageUploadMiddleware = (req: IRequest, res: Response, next: NextFunction) => {
    const fileUpload = new FileUpload();
    const prefix = 'demo/' + req.headers.demo_id;

    return fileUpload.S3multiUpload(req, res, next, {field: 'image', maxCount: 6, prefix: prefix});
}
