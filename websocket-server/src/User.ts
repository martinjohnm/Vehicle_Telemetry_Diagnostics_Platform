import { WebSocket } from "ws";
import { SubsciptionManager } from "./SubscriptionManager";
import { IncomingMessage, SUBSCRIBE, UNSUBSCRIBE } from "./types/in";
import { OutgoingMessage } from "./types/out";



export class User {

    private id : string;
    private ws : WebSocket;

    constructor(id : string, ws : WebSocket) {
        this.id = id;
        this.ws = ws;
        this.addListeners()
    }

    emit (message : OutgoingMessage) {
        this.ws.send(JSON.stringify(message))
    }

    private addListeners() {
        this.ws.on("message", (message: string) => {
            const parsedMessage : IncomingMessage = JSON.parse(message)
            console.log(parsedMessage, 'hai');
            
            if (parsedMessage.method === SUBSCRIBE) {
                parsedMessage.params.forEach(s => SubsciptionManager.getInstance().subscribe(this.id, s))

            }

            if (parsedMessage.method === UNSUBSCRIBE) {
                parsedMessage.params.forEach(s => SubsciptionManager.getInstance().unsubscribe(this.id, s))
            }
        })
    }
}