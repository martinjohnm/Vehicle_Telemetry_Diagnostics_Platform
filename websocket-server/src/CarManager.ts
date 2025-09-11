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


export interface AnalyticsData {
    type : string, 
    top_ten_cars : [string, CarData][]
    top_ten_speed : []
    top_ten_fuel : []
}

export class CarManager {
    private static instance : CarManager;
    private cars : Map<string, CarData> = new Map()
    public redisClient : RedisClientType
    private topTenCarsBySpeed : [string, CarData][] = []
    private topCarByFuelHeap : string[] = []

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

    

        for (const [carChannel, users] of SubsciptionManager.getInstance().reverseSubscriptions) {
            
            if (typeof(this.cars.get(carChannel)) != undefined) {
                //@ts-ignore
                users?.forEach(s => UserManager.getInstance().getUser(s)?.emit(this.cars.get(carChannel)))
            }

            
        }

        
        
        for (const [analyticsChannel, users] of SubsciptionManager.getInstance().analyticsReverseSubscriptions) {
            
            if (typeof(this.cars.get(analyticsChannel)) != undefined) {
                //@ts-ignore
                users?.forEach(s => UserManager.getInstance().getUser(s)?.emit_analytics({type : "ANALYTICS", 
                    top_ten_cars : this.topTenCarsBySpeed}))
            }

            
        }

    
    }

    private processCarData() {
  
        
        this.topTenCarsBySpeed = this.filterTopTenCarBySpeed()
        // console.log(this.topTenCarsBySpeed);
        
    }

    private filterTopTenCarBySpeed() {
        return [...this.cars.entries()]
    .sort((a, b) => b[1].speed - a[1].speed) // sort descending by speed
    .slice(0, 10)
    }

}