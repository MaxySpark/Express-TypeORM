import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { User } from '../entities/User.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User; 
    }

    beforeInsert(event: InsertEvent<User>) {
        console.log(`BEFORE POST INSERTED: `, event.entity);
        event.entity.active = false;
    }
}