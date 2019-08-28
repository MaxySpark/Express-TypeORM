import AuthService from './Auth.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './Auth.dto';
import { getConnection, getConnectionManager, getRepository, Repository } from "typeorm";
import { dbConncetionOptions } from '../../configs/orm.config';
import { ResetPassword } from '../../db/entities/ResetPassword.entity';

describe('Auth Service', () => {
    let authService: AuthService;
    let resetPasswordRepository: Repository<ResetPassword>;
    beforeAll(async () => {
        const connectionManager = getConnectionManager();
        const connection = connectionManager.create(dbConncetionOptions);
        await connection.connect();

        authService = new AuthService();
        resetPasswordRepository = getRepository(ResetPassword);
    });

    afterAll(async () => {
        await getConnection().close();
    });


    describe('Register User', () => {
        const user: RegisterDto = {
            email: 'test@test.com',
            firstname: 'Test',
            lastname: 'Test',
            password: 'password',
            username: 'testuser'

        };

        it('should return a string', async () => {

            const token = await authService.register(user);

            expect(token).toBeDefined();
        });

        it('should thow an error if email already exist', async () => {
            try {
                await authService.register(user);
            } catch (e) {
                expect(e.status).toEqual(409)
                expect(e.message).toEqual(`User with email ${user.email} already exists`)
            }
        });
    });

    describe('Login User', () => {
        it('should return a string', async () => {
            const user: LoginDto = {
                email: 'test@test.com',
                password: 'password',

            };
            const token = await authService.login(user);

            expect(token).toBeDefined();
        });

        it('should thow an error if password is wrong', async () => {
            try {
                const user: LoginDto = {
                    email: 'test@test.com',
                    password: 'wrong_password',
                };
                await authService.login(user);
            } catch (e) {
                expect(e.status).toEqual(401)
                expect(e.message).toEqual(`Email or Password Does not Matched`)
            }
        });
    });

    describe('Rreset Password', () => {

        let resetPassword: ResetPassword;
        const user: ResetPasswordDto = {
            email: 'test@test.com'
        };

        const user2: ResetPasswordDto = {
            email: 'test2@test.com'
        };

        it('should send generate a reset password object', async () => {
            await authService.resetPassword(user);
            resetPassword = await resetPasswordRepository.findOne({email: user.email});
            expect(resetPassword.email).toEqual('test@test.com');
        });

        it('should throw an error if user not exist with email', async () => {
            try {
                await authService.resetPassword(user2);
            } catch(e) {
                expect(e.status).toEqual(404);
                expect(e.message).toEqual(`User with email ${user2.email} does not exist`)
            }
        });
    });
});