import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import {validate} from 'class-validator';
import User from "../entities/user";

@EventSubscriber()
export class ValidationSubscriber implements EntitySubscriberInterface {

    async beforeInsert(event: InsertEvent<User>) {
        const errors = await validate(event.entity)
        if (!errors.length) return

        throw errors[0];
    }
}