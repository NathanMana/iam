import * as dotenv from 'dotenv'
import { DataSource } from "typeorm"

// Entities
import User from '../entities/user'

dotenv.config()

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DBB_USERNAME,
    password: process.env.DBB_PASSWORD,
    database: "iam",
    dropSchema: true,
    entities: [User],
    synchronize: true
})

const run = () => {
    
    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })
}


export default run;