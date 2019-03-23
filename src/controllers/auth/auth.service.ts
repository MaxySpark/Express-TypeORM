import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../db/entities/User.entity';
import { RegisterDto } from './auth.dto';
import UserWithThatEmailExistException from '../../exceptions/UserWIthThatEmailExistExcepiton';

class AuthService {
    private userRepository = getRepository(User);

    public async register(userData: RegisterDto) {
        if (await this.userRepository.findOne({ email: userData.email})) {
            throw new UserWithThatEmailExistException(userData.email);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword
        });
        await this.userRepository.save(user);
        
    } 
}