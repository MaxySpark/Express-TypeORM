import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import * as gp from 'generate-password';
import * as rp from 'request-promise';

import { User } from '../../db/entities/User.entity';
import { RegisterDto, LoginDto, GoogleLoginDto, FacebookLoginDto } from './Auth.dto';
import UserWithThatEmailExistException from '../../exceptions/UserWIthThatEmailExistExcepiton';
import appconfig from '../../configs/app.config';
import { IJwtPayload } from '../../interfaces/JwtPayload.interface';
import LoginFailedException from '../../exceptions/LoginFailedException';
import OauthConfig from './../../configs/oauth.config';
import GoogleLoginFailedException from '../../exceptions/GoogleLoginFailedException';
import { IFbLoginResponse } from '../../interfaces/FbDataReponse.interface';
import FacebookLoginFailedException from '../../exceptions/FacebookLoginFailedException';
import { JwtSignOptions } from '../../configs/jwt.config';

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

        const dataStoredInToken: IJwtPayload = {
            id: user.id,
            email: user.email
        }

        const signOptions: jwt.SignOptions = {
            issuer: 'MaxySpark',
            expiresIn: '5h',
            // algorithm : 'RS256' 
        }
        const token = jwt.sign(dataStoredInToken, secret, JwtSignOptions);
        return token;
    }

    public async googleOauth(userData: GoogleLoginDto) {
        try {
            const googleClient = new OAuth2Client(OauthConfig.google.clientId);
            const ticket = await googleClient.verifyIdToken({
                idToken: userData.idToken,
                audience: OauthConfig.google.clientId
            })
            const payload = ticket.getPayload();

            if (payload.aud === OauthConfig.google.clientId) {
                const user = await this.userRepository.findOne({ email: payload.email });
                if (user) {
                    return this.createToken(user);
                }

                const new_user = this.userRepository.create({
                    email: payload.email,
                    firstname: payload.given_name,
                    lastname: payload.family_name,
                    username: payload.sub,
                    password: gp.generate({
                        length: 10,
                        numbers: true,
                        symbols: true
                    }),
                    active: true
                });

                await this.userRepository.save(new_user);
                new_user.password = undefined;

                return this.createToken(new_user);
            } else {
                throw new GoogleLoginFailedException();
            }
        } catch (e) {
            console.log(e);
            throw new GoogleLoginFailedException();
        }

    }

    public async facebookLogin(userData: FacebookLoginDto) {
        const verify_options = {
            uri: 'https://graph.facebook.com/debug_token?input_token=' + userData.accessToken + '&access_token=' + OauthConfig.facebook.appId + '|' + OauthConfig.facebook.appSecret,
            json: true
        };

        const verify_data = await rp(verify_options);

        if (verify_data.data.hasOwnProperty('error') || verify_data.data.app_id !== OauthConfig.facebook.appId || !verify_data.data.is_valid) {
            throw new FacebookLoginFailedException();
        }

        const options = {
            uri: 'https://graph.facebook.com/me?fields=id,name,first_name,last_name,picture.width(1000).height(1000),email',
            headers: {
                'Authorization': 'Bearer ' + userData.accessToken
            },
            json: true
        };
        const fb_data: IFbLoginResponse = await rp(options);

        const user = await this.userRepository.findOne({ email: fb_data.email });
        if (user) {
            return this.createToken(user);
        }

        const new_user = this.userRepository.create({
            email: fb_data.email,
            firstname: fb_data.first_name,
            lastname: fb_data.last_name,
            username: fb_data.id,
            password: gp.generate({
                length: 10,
                numbers: true,
                symbols: true
            }),
            active: true
        });

        await this.userRepository.save(new_user);
        new_user.password = undefined;

        return this.createToken(new_user);
    }

}

export default AuthService;