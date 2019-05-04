import { Response } from 'express';

export const responseWrapper = (res: Response, obj: { status?: number, message?: string, data?: object }) => {
    res.statusCode = typeof obj.status !== 'number' ? 200 : obj.status;

    return res.send({
        code: typeof status !== 'number' ? 200 : obj.status,
        message: typeof obj.message !== 'string' ? 'Request Success' : obj.message,
        data: typeof obj.data !== 'object' ? {} : obj.data
    })
}
