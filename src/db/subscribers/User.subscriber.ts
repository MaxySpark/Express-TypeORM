import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { User } from '../entities/User.entity';

import * as bcrypt from 'bcrypt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User; 
    }

    async beforeInsert(event: InsertEvent<User>) {
        const hashedPassword = await bcrypt.hash(event.entity.password, 10);
        event.entity.password = hashedPassword;
    }
}