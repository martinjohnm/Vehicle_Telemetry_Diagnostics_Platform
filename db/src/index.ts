import { Client } from "pg";
import { createClient } from "redis";



const pgClient = new Client({
    user : "your_user",
    host : "localhost",
    database : "my_database",
    password : "your_password",
    port : 5432
})

pgClient.connect()