import { WebSocket } from "ws";



export class Car {

    private id : string;
    private ws : WebSocket
    
    constructor(id: string, ws : WebSocket) {
        this.id = id;
        this.ws = ws
    }

}