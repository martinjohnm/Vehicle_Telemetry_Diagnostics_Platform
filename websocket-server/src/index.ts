


import { WebSocketServer } from "ws"
import { SubsciptionManager } from "./SubscriptionManager"
import { UserManager } from "./UserManager"
import { CarManager } from "./CarManager"

// subscribe to the cars:data channel first
CarManager.getInstance()

const wss = new WebSocketServer({ port: 3001 })


wss.on("connection", (ws) => {
    UserManager.getInstance().addUser(ws)
})