import * as dotenv from 'dotenv'
import { DataSource } from "typeorm"

// Entities
import User from '../entities/user'
import { ValidationSubscriber } from '../subscribers/ValidationSubscriber'
import { DBB_NAME, DBB_PASSWORD, DBB_PORT, DBB_USERNAME } from './dotenv'

dotenv.config()

/**
 * Le fait d'initialiser le datasource dans une méthode permet de ne pas avoir l'erreur No metadata found
 */
export const getAppDataSource = () : DataSource => {
    return new DataSource({    
        type: "postgres",
        host: "127.0.0.1",
        port: DBB_PORT,
        username: DBB_USERNAME,
        password: DBB_PASSWORD,
        database: DBB_NAME,
        entities: [User],
        synchronize: true,
        subscribers: [ValidationSubscriber]
    })
}

export const getAppDataSourceInitialized = async () : Promise<DataSource> => {
    return getAppDataSource().initialize()
}