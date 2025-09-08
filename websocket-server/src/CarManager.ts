import { WebSocket } from "ws";
import { Car } from "./Car";
import { SubsciptionManager } from "./SubscriptionManager"
import { createClient, RedisClientType } from "redis";
import { PriorityQueue } from "@datastructures-js/priority-queue";
import { UserManager } from "./UserManager";

export interface CarData {
  type: string;
  id: string;
  city: string;
  speed: number;
  latitude: number;
  longitude: number;
  fuel_level: number;
  direction: number;
  status: string;
  timestamp: number;
}

export class CarManager {
    private static instance : CarManager;
    private cars : Map<string, CarData> = new Map()
    public redisClient : RedisClientType

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
        this.subscribe("cars:data")
        
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new CarManager()
        }

        return this.instance
    }


    public subscribe(subscription : string) {
        this.redisClient.subscribe(subscription, this.redisCallBackHandler)
    }

    private redisCallBackHandler = (message : string, channel : string) => {
        const parsedMessage = JSON.parse(message);
        for (const [key, value] of Object.entries(parsedMessage)) {

            const carData: CarData = {
                type: (value as any)["type"],
                id: (value as any)["id"],
                city: (value as any)["city"],
                speed: Number((value as any)["speed"]),
                latitude: Number((value as any)["latitude"]),
                longitude: Number((value as any)["longitude"]),
                fuel_level: Number((value as any)["fuel_level"]),
                direction: Number((value as any)["direction"]),
                status: (value as any)["status"],
                timestamp: Number((value as any)["timestamp"]),
            };
            this.cars.set(key, carData)
        }
        this.processCarData()

    
        console.log(SubsciptionManager.getInstance().reverseSubscriptions);
        

        for (const [carChannel, users] of SubsciptionManager.getInstance().reverseSubscriptions) {
            
            if (typeof(this.cars.get(carChannel)) != undefined) {
                //@ts-ignore
                users?.forEach(s => UserManager.getInstance().getUser(s)?.emit(this.cars.get(carChannel)))
            }

            
        }
    }

    private processCarData() {
  
        const top10 = this.getTop10Cars()
        const speedArr = top10.map(([_, data]) => data.speed)
        console.log(speedArr, top10[0]);
        
    }

    private getTop10Cars() {
        return [...this.cars.entries()]
    .sort((a, b) => b[1].speed - a[1].speed) // sort descending by speed
    .slice(0, 10)
    }

}