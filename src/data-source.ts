import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import {GiftCode} from "./entity/GiftCode";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123456",
    database: "transaction-demo",
    synchronize: true,
    logging: true,
    entities: [User, GiftCode],
    migrations: [],
    subscribers: [],
})
