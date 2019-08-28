import AuthService from './Auth.service';
import { IJwtPayload } from '../../interfaces/JwtPayload.interface';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './Auth.dto';
import { getConnection, getConnectionManager, createConnection } from "typeorm";
import { dbConncetionOptions } from '../../configs/orm.config';

describe('Auth Service', () => {
    let authService: AuthService;
    beforeAll(async () => {
        const connectionManager = getConnectionManager();
        const connection = connectionManager.create(dbConncetionOptions);
        await connection.connect();
        authService = new AuthService();
    });

    afterAll(async () => {
        await getConnection().close();
    });


    describe('Create User', () => {
        it('should return a string', async () => {
            const user: RegisterDto = {
                email: 'test@test.com',
                firstname: 'Test',
                lastname: 'Test',
                password: '1234567890',
                username: 'testuser'

            };
            const token = await authService.register(user);

            expect(token).toBeDefined();
        });
    });
});