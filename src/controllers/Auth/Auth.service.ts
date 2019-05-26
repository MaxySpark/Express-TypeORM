import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import * as gp from 'generate-password';
import * as rp from 'request-promise';
import * as crypto from 'crypto';
import * as moment from 'moment';

import { User } from '../../db/entities/User.entity';
import { RegisterDto, LoginDto, GoogleLoginDto, FacebookLoginDto, ResetPasswordDto, CheckResetPasswordDto, SetNewPasswordDto } from './Auth.dto';
import appconfig from '../../configs/app.config';
import { IJwtPayload } from '../../interfaces/JwtPayload.interface';
import OauthConfig from './../../configs/oauth.config';
import { IFbLoginResponse } from '../../interfaces/FbDataReponse.interface';
import { JwtSignOptions } from '../../configs/jwt.config';
import { ResetPassword } from '../../db/entities/ResetPassword.entity';
import { UserWithThatEmailExistException, LoginFailedException, GoogleLoginFailedException, FacebookLoginFailedException, UserWIthThatEmailDoesNotExistExcepiton, ResetPasswordLinkExpiredExcepiton } from '../../exceptions/Auth.exceptions';

class AuthService {
    private userRepository = getRepository(User);
    private resetPasswordRepository = getRepository(ResetPassword);

    public async register(userData: RegisterDto) {
        if (await this.userRepository.findOne({ email: userData.email })) {
            throw new UserWithThatEmailExistException(userData.email);
        }

        const user = this.userRepository.create(userData);
        user.provider = 'local';
        user.activation_key = crypto.randomBytes(20).toString('hex');
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
                    active: true,
                    provider: 'google'
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
            active: true,
            provider: 'facebook'
        });

        await this.userRepository.save(new_user);
        new_user.password = undefined;

        return this.createToken(new_user);
    }

    // Password Reset Link Generate/Send Method
    public async resetPassword(userData: ResetPasswordDto) {
        const user = await this.userRepository.findOne({ email: userData.email });

        if (!user) {
            throw new UserWIthThatEmailDoesNotExistExcepiton(userData.email);
        }

        // last reset_key expire
        const last_reset = await this.resetPasswordRepository.findOne({ email: user.email, expired: false });

        if (last_reset) {
            last_reset.expired = true;
            await this.resetPasswordRepository.save(last_reset);
        }

        const reset_key = crypto.randomBytes(20).toString('hex');

        // TODO reset link send mail

        const resetPassObj = new ResetPassword();
        resetPassObj.email = user.email;
        resetPassObj.uuid = user.uuid;
        resetPassObj.reset_key = reset_key;
        await this.resetPasswordRepository.save(resetPassObj);
    }

    // Password Reset Link Validation Method
    public async checkResetPasswordRequest(userData: CheckResetPasswordDto) {
        const last_reset = await this.resetPasswordRepository.findOne({ email: userData.email, reset_key: userData.resetKey, expired: false });

        if(!last_reset) {
            throw new ResetPasswordLinkExpiredExcepiton();
        }

        const now = moment();
        const reset_key_time = moment(+ last_reset.createdAt).add(24, 'hours');
        const time_diff = reset_key_time.diff(now);
        const expire_limit = 86400000; // 24 hours
        // check if 24 hours+ && uuid match
        if (last_reset.uuid === userData.uuid && time_diff > 0 && time_diff < expire_limit) {
            return {
                'email': last_reset.email,
                'reset_key': last_reset.reset_key,
                'isValid': true
            };
        } else {
            last_reset.expired = true;
            await this.resetPasswordRepository.save(last_reset);
            throw new ResetPasswordLinkExpiredExcepiton();
        }

    }

    // Set New Password Method
    public async setnewPassword(userData: SetNewPasswordDto) {
        const user = await this.userRepository.findOne({ email: userData.email, uuid: userData.uuid });

        if (!user) {
            throw new UserWIthThatEmailDoesNotExistExcepiton(userData.email);
        }

        const last_reset = await this.resetPasswordRepository.findOne({ email: userData.email, uuid: userData.uuid, reset_key: userData.resetKey, expired: false });

        if(!last_reset) {
            throw new ResetPasswordLinkExpiredExcepiton();
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        user.password = hashedPassword;
        await this.userRepository.save(user);

        last_reset.reset = true;
        last_reset.expired = true;
        await this.resetPasswordRepository.save(last_reset);

        return {
            pass_update: true,
            email: userData.email
        }
    }

}

export default AuthService;