
import { createClient, RedisClientType } from "redis";



export class SubsciptionManager {


    public redisClient : RedisClientType
    public static instance : SubsciptionManager;

    private constructor() {
        this.redisClient = createClient()
        this.redisClient.connect()
    }

    public static getInstance () {
        if (!this.instance) {
            this.instance = new SubsciptionManager()
        }

        return this.instance
    }

    public subscribe(userId : string, subscription : string) {
        this.redisClient.subscribe(subscription, function redisCallBackHandler(message : string, channel : string) {
            const parsedMessage = JSON.parse(message);
            console.log(parsedMessage);
            
        })
    }
}