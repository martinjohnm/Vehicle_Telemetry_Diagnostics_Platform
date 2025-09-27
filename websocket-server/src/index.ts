


import { WebSocketServer } from "ws"
import { SubsciptionManager } from "./SubscriptionManager"
import { UserManager } from "./UserManager"
import { CarManager } from "./CarManager"

import dotenv from 'dotenv';
dotenv.config(); // loads .env into process.env

// subscribe to the cars:data channel first
CarManager.getInstance()

const port = Number(process.env.PORT) ?? 3001

const wss = new WebSocketServer({ port })


wss.on("connection", (ws) => {
    UserManager.getInstance().addUser(ws)
})