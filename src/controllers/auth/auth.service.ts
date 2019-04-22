import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library'
import * as gp from 'generate-password'

import { User } from '../../db/entities/User.entity';
import { RegisterDto, LoginDto, GoogleLoginDto, FacebookLoginDto } from './auth.dto';
import UserWithThatEmailExistException from '../../exceptions/UserWIthThatEmailExistExcepiton';
import appconfig from '../../configs/app.config';
import { DataStoredInToken } from '../../interfaces/jwt.interface';
import LoginFailedException from '../../exceptions/LoginFailedException';
import OauthConfig from './../../configs/oauth.config';
import GoogleLoginFailedException from '../../exceptions/GoogleLoginFailedException';

class AuthService {
    private userRepository = getRepository(User);

    public async register(userData: RegisterDto) {
        if (await this.userRepository.findOne({ email: userData.email })) {
            throw new UserWithThatEmailExistException(userData.email);
        }

        const user = this.userRepository.create(userData);

        await this.userRepository.save(user);
        user.password = undefined;

        return this.createToken(user);
    }

    public async login(userData: LoginDto) {
        const user = await this.userRepository.findOne({ email: userData.email });
        if (!user) {
            throw new LoginFailedException();
        }
        
        if (await bcrypt.compare(userData.password, user.password)) {
            return this.createToken(user);
        } else {
            throw new LoginFailedException();
        }
    }

    private createToken(user: User) {
        const secret = appconfig.JWT_SECRET;

        const dataStoredInToken: DataStoredInToken = {
            id: user.id,
            email: user.email
        }

        const signOptions: jwt.SignOptions = {
            issuer: 'MaxySpark',
            expiresIn: '5h',
            // algorithm : 'RS256' 
        }
        const token = jwt.sign(dataStoredInToken, secret, signOptions);
        return token;
    }

    public async googleOauth(userData: GoogleLoginDto) {
        try {
            const googleClient = new OAuth2Client(OauthConfig.google.clientId);
            const ticket = await googleClient.verifyIdToken({
                idToken : userData.idToken,
                audience : OauthConfig.google.clientId
            })
            const payload = ticket.getPayload();
    
            if (payload.aud === OauthConfig.google.clientId) {
                const user = await this.userRepository.findOne({ email: payload.email });
                if (user) {
                    return this.createToken(user);
                }

                const new_user = this.userRepository.create({
                    email : payload.email,
                    firstname : payload.given_name,
                    lastname : payload.family_name,
                    username : payload.sub,
                    password : gp.generate({
                        length : 10,
                        numbers : true,
                        symbols : true
                    }),
                    active : true
                });
                
                await this.userRepository.save(new_user);
                new_user.password = undefined;
    
                return this.createToken(new_user);
            } else {
                throw new GoogleLoginFailedException();
            }
        } catch(e) {
            console.log(e);
            throw new GoogleLoginFailedException();
        }
        
    }

    public async facebookLogin(userData: FacebookLoginDto) {
        // todo
    }

}

export default AuthService;