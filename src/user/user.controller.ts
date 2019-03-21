import { Request, Response, NextFunction } from 'express';
import { getManager } from 'typeorm';
import { User } from '../db/entity/User';

class UserController {

    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        const entityManager = getManager();
        const users = await entityManager.find(User)
        res.status(200).json({
            users: users
        });
    }
}

export default UserController;