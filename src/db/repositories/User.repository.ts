import { EntityRepository, AbstractRepository } from 'typeorm'
import { User } from '../entity/User.entity';

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
    public save(user: User): Promise<User> {
        user.password = user.password.split('').reverse().join('');
        return this.manager.save(user);
    }
}