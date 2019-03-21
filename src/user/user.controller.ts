import { Request, Response, NextFunction } from 'express';
import { getManager, getRepository, Repository, Connection } from 'typeorm';
import { User } from '../db/entities/User.entity';

class UserController {
    private repository: Repository<User>;
 
    constructor() {
        this.repository =  getRepository(User);
    }

    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        const users = await this.repository.find();
        res.status(200).json({
            users: users
        });
    }
}

export default UserController;