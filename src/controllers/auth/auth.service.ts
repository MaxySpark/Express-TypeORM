import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../../db/entities/User.entity';
import { RegisterDto, LoginDto } from './auth.dto';
import UserWithThatEmailExistException from '../../exceptions/UserWIthThatEmailExistExcepiton';
import appconfig from '../../configs/app.config';
import { DataStoredInToken } from '../../interfaces/jwt.interface';
import LoginFailedException from '../../exceptions/LoginFailedException';

class AuthService {
    private userRepository = getRepository(User);

    public async register(userData: RegisterDto) {
        if (await this.userRepository.findOne({ email: userData.email})) {
            throw new UserWithThatEmailExistException(userData.email);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password : hashedPassword
        });
        console.log(user);
        await this.userRepository.save(user);
        
        user.password = undefined;

        return this.createToken(user);
    }

    public async login(userData: LoginDto) {
        const user = await this.userRepository.findOne({ email: userData.email });

        const isMatchPassword = await bcrypt.compare(userData.password, user.password);

        if (isMatchPassword) {
            return this.createToken(user);
        } else {
            throw new LoginFailedException();
        }
    }

    private createToken(user: User) {
        const secret = appconfig.JWT_SECRET;

        const dataStoredInToken: DataStoredInToken = {
            id : user.id,
            email : user.email
        }

        const signOptions: jwt.SignOptions = {
            issuer : 'MaxySpark',
            expiresIn : '5h',
            // algorithm : 'RS256' 
        }
        const token = jwt.sign(dataStoredInToken, secret, signOptions);
        console.log(token);
        return token;
    }
}

export default AuthService;