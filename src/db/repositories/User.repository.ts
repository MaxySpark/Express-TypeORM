import { EntityRepository, AbstractRepository } from 'typeorm'
import { User } from '../entities/User.entity';

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {

    public save(user: User): Promise<User> {
        user.password = user.password.split('').reverse().join('');
        return this.manager.save(user);
    }

    public findActive(value: boolean): Promise<User[]> {
        return this.repository.createQueryBuilder('user')
            .where('user.active = :value',{ value : value})
            .getMany();
    }
}