
import {createClient, RedisClientType} from "redis"



export class SubsciptionManager {

    public static instance : SubsciptionManager;
    private subscriptions : Map<string, string[]> = new Map();
    private reverseSubscriptions : Map<string, string[]> = new Map();
    private redisClient : RedisClientType


    private constructor() {
        this.redisClient = createClient();
    }
}