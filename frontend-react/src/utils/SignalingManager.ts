import { API_BASES } from "../config";
import type { AnalyticsData, CarData } from "../types/car";
import type { OutgoingMessage } from "../types/out";




export const BASE_URL = API_BASES.WS_SERVER


export class SignalingManager {
    private ws : WebSocket;
    private static instance: SignalingManager;
    private bufferedMessages: OutgoingMessage[] = [];
    private callBacks: Map<string, {callback: any, id: string}[]>
    private id: number;
    private initialized: boolean = false




    private constructor() {
        this.ws = new WebSocket(BASE_URL)
        this.bufferedMessages = [];
        this.callBacks = new Map()
        this.id = 1;
        this.init()
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SignalingManager()
        }

        return this.instance
    }

    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            })

            this.bufferedMessages = []
        }

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            
            const type = message.type

            

            if (this.callBacks.has(type)) {
                this.callBacks.get(type)?.forEach(({callback} : {callback: any}) => {
                    if (type == "CAR") {
                        callback(message as CarData)
                    }

                    if (type == "ANALYTICS") {
                        callback(message as AnalyticsData)
          
                    }
                })
            }
        }
    }

    sendMessage(message : OutgoingMessage) {
        const messageToSend = {
            ...message,
            id : this.id++
        }

        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
            return;
        }

        this.ws.send(JSON.stringify(messageToSend))
    }


    async registerCallBack(type: string, callback: any, id: string) {
        console.log("callback registered");
        
        this.callBacks.set(type, (this.callBacks.get(type) || []).concat({callback, id}))
    }

    async deregisterCallBack(type : string, id : string) {
        console.log("callback dereg");
        
        if(this.callBacks.has(type)) {
            const newCallBacks = this.callBacks.get(type)?.filter(callback => callback.id == id ) ?? []
            this.callBacks.set(type, newCallBacks)
        }
    }
}