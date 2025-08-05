


import { WebSocketServer } from "ws"
import { SubsciptionManager } from "./SubscriptionManager"
import { UserManager } from "./UserManager"

const wss = new WebSocketServer({ port: 3001 })


wss.on("connection", (ws) => {
    UserManager.getInstance().addUser(ws)
})