import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { User } from '../../db/entities/User.entity';
import UserRepository from '../../db/repositories/User.repository'

class UserController {
    private repository: UserRepository;
 
    constructor() {
        this.repository = getCustomRepository(UserRepository);
    }

    public getActiveUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const activeUser = await this.repository.findActive(req.body.active);

            res.status(201).json({
                user: activeUser
            });
        } catch (error) {
            next(error);
        }

    }
}

export default UserController;