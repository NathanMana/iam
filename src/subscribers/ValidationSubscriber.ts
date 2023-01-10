import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import {validate} from 'class-validator';

@EventSubscriber()
export class ValidationSubscriber<Entity extends {id: number}> implements EntitySubscriberInterface {

    async beforeInsert(event: InsertEvent<Entity>) {
        await this.manageValidation(event.entity)
    }

    async beforeUpdate(event: UpdateEvent<Entity>) {
        if (!(event.entity instanceof event.databaseEntity.constructor())) 
            throw new Error("Litteral type, not instance of object in database")

        await this.manageValidation(event.entity as Entity)    
    }

    async manageValidation(entityValue: Entity) {
        const errors = await validate(entityValue, {stopAtFirstError: true})
        if (!errors.length) return

        throw errors[0]
    }
}