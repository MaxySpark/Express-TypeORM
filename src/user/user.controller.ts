import { Request, Response, NextFunction } from 'express';

class UserController {

    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({
            users: [{
                name: 'Bhargab',
                ph: 1234567890
            }]
        });
    }
}

export default UserController;