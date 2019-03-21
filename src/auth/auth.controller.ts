import { Request, Response, NextFunction } from 'express';
import { Repository, getCustomRepository } from 'typeorm';
import { User } from '../db/entities/User.entity';
import { validate } from 'class-validator';
import UserRepository from '../db/repositories/User.repository'

class AuthController {
    private repository: UserRepository;

    constructor() {
        this.repository = getCustomRepository(UserRepository);
    }

    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = new User();
            user.email = req.body.email;
            user.firstName = req.body.firstname;
            user.lastName = req.body.lastname;
            user.username = req.body.username;
            user.password = req.body.password;
            user.active = req.body.active;
            const errors = await validate(user);
            if (errors.length > 0) {
                console.log(errors);
                throw 400;
            }
            await this.repository.save(user);

            res.status(201).json({
                user: user
            });
        } catch (error) {
            if (error === 400) {
                res.status(400).send('Bad Request');
            }
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