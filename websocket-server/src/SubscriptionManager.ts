
import {createClient, RedisClientType} from "redis"
import { UserManager } from "./UserManager";



export class SubsciptionManager {

    public static instance : SubsciptionManager;
    private subscriptions : Map<string, string[]> = new Map();
    private reverseSubscriptions : Map<string, string[]> = new Map();
    public redisClient : RedisClientType


    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
    }

    public static getInstance () {
        if (!this.instance) {
            this.instance = new SubsciptionManager()
        }

        return this.instance
    }
    

    public subscribe(userId : string, subscription : string) {
        if (this.subscriptions.get(userId)?.includes(subscription)) {
            return
        }

        this.subscriptions.set(userId, (this.subscriptions.get(userId) || []).concat(subscription));
        this.reverseSubscriptions.set(subscription, (this.reverseSubscriptions.get(subscription) || []).concat(userId))

        if (this.reverseSubscriptions.get(subscription)?.length === 1) {
            this.redisClient.subscribe(subscription, this.redisCallBackHandler)
        }
    }

    private redisCallBackHandler = (message : string, channel : string) => {
        const parsedMessage = JSON.parse(message);
        this.reverseSubscriptions.get(channel)?.forEach(s => UserManager.getInstance())
    }

    public unsubscribe(userId : string, subscription : string) {
        const existingSubscriptions = this.subscriptions.get(userId)

        if (existingSubscriptions) {
            this.subscriptions.set(userId, existingSubscriptions.filter(s => s!== userId));

        }

        const reverseExistingSubscriptions = this.reverseSubscriptions.get(subscription)

        if (reverseExistingSubscriptions) {
            this.reverseSubscriptions.set(subscription, reverseExistingSubscriptions.filter(s => s!== userId))

            if (this.reverseSubscriptions.get(subscription)?.length === 0) {
                this.reverseSubscriptions.delete(subscription);
                this.redisClient.unsubscribe(subscription)
            }
        }
    }
}