import { WebSocket } from "ws";
import { User } from "./User";
import { SubsciptionManager } from "./SubscriptionManager";



export class UserManager {
    
    private static instance : UserManager;
    private users : Map<string, User> = new Map()

    
    private constructor() {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager()
        }

        return this.instance
    }

    public addUser(ws : WebSocket) {
        const id = this.getRandomId()
        const user = new User(id, ws)
        this.users.set(id, user)
        this.registerOnClose(ws, id)

        console.log(this.users);
        

    }

    public getUser(id : string) {
        return this.users.get(id)
    }

    private registerOnClose(ws : WebSocket, id : string) {
        ws.on("close", () => {
            this.users.delete(id)
            SubsciptionManager.getInstance().userLeft(id)
        })
    }

    private getRandomId() {
        return Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15)
    }

}