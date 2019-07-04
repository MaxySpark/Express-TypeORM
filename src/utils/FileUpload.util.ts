import * as multer from 'multer'
import * as multerS3 from 'multer-s3';
import { S3 } from 'aws-sdk';
import { AwsConfig } from '../configs/aws.config';
import * as _ from 'lodash';
import { IRequest } from '../interfaces/Request.interface';
import { UnsupportedFileTypeException } from '../exceptions/FIleUpload.exception';
import { Response, NextFunction } from 'express';

export class FileUpload {

    private s3: S3 = new S3({
        accessKeyId: AwsConfig.ACCESS_KEY_ID,
        secretAccessKey: AwsConfig.SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: AwsConfig.S3.REGION,
    });

    constructor(s3?: S3) {
        this.s3 = s3 ? s3 : this.s3;
    }

    private fileFilter = (fileType: string[]) => {
            return (req: IRequest, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
                if (fileType.length <= 0) {
                    callback(null, true);
                    return;
                }

                if (_.find(fileType, (o) => o === file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new UnsupportedFileTypeException(), false);
                }
            };
    }


    public S3multiUpload = (req: IRequest, res: Response, next: NextFunction, option: { prefix?: string, field: string, maxCount: number, fileType?: string[] }) => {
        const prefix = option.prefix ? option.prefix + '/' : '';
        const fileType = option.fileType ? option.fileType : [];

        const upload = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: AwsConfig.S3.BUCKET_NAME,
                metadata: (req, file, cb) => {
                    cb(null, { fieldName: file.fieldname, uploadTime: Date.now().toString() });
                },
                key: (req, file, cb) => {
                    cb(null, prefix + Date.now().toString() + '_' + file.originalname.replace(/\ /g, '_'))
                }
            }),
            fileFilter: this.fileFilter(fileType)
        });

        return upload.array(option.field, option.maxCount)(req, res, next);
    }


}