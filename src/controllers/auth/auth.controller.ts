import { Request, Response, NextFunction } from 'express';
import { Repository, getCustomRepository } from 'typeorm';
import { User } from '../../db/entities/User.entity';
import UserRepository from '../../db/repositories/User.repository'
import { RegisterDto } from './auth.dto';

class AuthController {
    private repository: UserRepository;

    constructor() {
        this.repository = getCustomRepository(UserRepository);
    }

    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = new User();
            const userData: RegisterDto = req.body;

            user.email = userData.email;
            user.firstname = userData.firstname;
            user.lastname = userData.lastname;
            user.username = userData.username;
            user.password = userData.password;  

            await this.repository.save(user);

            res.status(201).json({
                user: user
            });
        } catch (error) {
            next(error);
        }

    }

    public getActiveUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const activeUser = await this.repository.findActive(req.body.active);

            res.status(201).json({
                user: activeUser
            });
        } catch (error) {
            if (error === 400) {
                res.status(400).send('Bad Request');
            }
        }

    }

    
}

export default AuthController;