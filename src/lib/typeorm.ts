import * as dotenv from 'dotenv'
import { DataSource } from "typeorm"

// Entities
import User from '../entities/user'
import { ValidationSubscriber } from '../subscribers/ValidationSubscriber'

dotenv.config()

/**
 * Le fait d'initialiser le datasource dans une méthode permet de ne pas avoir l'erreur No metadata found
 */
export const getAppDataSource = () : DataSource => {
    return new DataSource({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: process.env.DBB_USERNAME,
        password: process.env.DBB_PASSWORD,
        database: process.env.NODE_ENV === 'test' ? "iam_test": 'iam',
        entities: [User],
        synchronize: true,
        subscribers: [ValidationSubscriber]
    })
}

export const getAppDataSourceInitialized = async () : Promise<DataSource> => {
    return getAppDataSource().initialize()
}