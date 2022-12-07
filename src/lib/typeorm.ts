import * as dotenv from 'dotenv'
import { DataSource } from "typeorm"

// Entities
import User from '../entities/user'
import { ValidationSubscriber } from '../subscribers/ValidationSubscriber'

dotenv.config()

export const AppDataSource = new DataSource({
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

export const runDataSource = async () => {
    try {
        await AppDataSource.initialize()
        console.log("Data Source has been initialized!")
    }
    catch(err) {
        console.error("Error during Data Source initialization", err)
    }
}