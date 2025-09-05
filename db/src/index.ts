import { Client } from "pg";
import { createClient } from "redis";
import { SubsciptionManager } from "./SubscriptionManager";



// const pgClient = new Client({
//     user : "your_user",
//     host : "localhost",
//     database : "my_database",
//     password : "your_password",
//     port : 5432
// })

// pgClient.connect()

const subscriptionManager = SubsciptionManager.getInstance()

subscriptionManager.readFromTheStream("db-service-group-2", "db-consumer-2", "telematics_stream")