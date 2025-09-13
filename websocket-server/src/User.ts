import { WebSocket } from "ws";
import { SubsciptionManager } from "./SubscriptionManager";
import { IncomingMessage, SUBSCRIBE, SUBSCRIBE_ANALYTICS, UNSUBSCRIBE, UNSUBSCRIBE_ANALYTICS } from "./types/in";
import { OutgoingMessage } from "./types/out";
import { CarData, AnalyticsData } from "./types/car";



export class User {

    private id : string;
    private ws : WebSocket;

    constructor(id : string, ws : WebSocket) {
        this.id = id;
        this.ws = ws;
        this.addListeners()
    }

    emit (message : CarData) {
        this.ws.send(JSON.stringify(message))
    }

    emit_analytics(message: AnalyticsData) {
        this.ws.send(JSON.stringify(message))
    }

    private addListeners() {
        this.ws.on("message", (message: string) => {
            const parsedMessage : IncomingMessage = JSON.parse(message)
           
            if (parsedMessage.method === SUBSCRIBE) {
                parsedMessage.params.forEach(s => SubsciptionManager.getInstance().subscribe(this.id, s))

            }

            if (parsedMessage.method === UNSUBSCRIBE) {
                parsedMessage.params.forEach(s => SubsciptionManager.getInstance().unsubscribe(this.id, s))
            }
            
            if (parsedMessage.method === SUBSCRIBE_ANALYTICS) {
                parsedMessage.params.forEach(s => SubsciptionManager.getInstance().subscribeAnalytics(this.id, s))
            }
            if (parsedMessage.method === UNSUBSCRIBE_ANALYTICS) {
                parsedMessage.params.forEach(s => SubsciptionManager.getInstance().unSubscribeAnalytics(this.id, s))
            }
        })
    }
}