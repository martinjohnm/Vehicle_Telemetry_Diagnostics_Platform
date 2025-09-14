import { WebSocket } from "ws";
import { Car } from "./Car";
import { SubsciptionManager } from "./SubscriptionManager"
import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager";
import { MaxPriorityQueue } from "./heap/MaxPriorityQueue";
import { CarData, SpeedBin } from "./types/car";

export class CarManager {
    private static instance : CarManager;
    private cars : Map<string, CarData> = new Map()
    public redisClient : RedisClientType

    // analytics
    private topTenCarsBySpeed : [string, CarData][] = []
    private speedHistogram : SpeedBin[] = []
    private carCountByCity : Map<string, number> = new Map()
    private carAggrLatLangByCity : Map<string,[number,number]> = new Map()

    private carLatAndLngArrByCity : Map<string, [number, number][]> = new Map()

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
        this.subscribe("cars:data")
        this.initBuckets(0,280,20)
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

        let kk = 0;
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
                    
                    top_ten_cars : this.topTenCarsBySpeed,
                    speed_histogram : this.speedHistogram,
                    car_count_by_city : Array.from(this.carCountByCity, ([key, val]) => ({key, val})),
                    car_aggr_lat_lng_city : Array.from(this.carAggrLatLangByCity, ([key, val]) => ({key, val}))
                }
                ) )
            }

            
        }

    
    }

    private processCarData() {
  
        this.filterTopTenCarBySpeed()
        this.createSpeedHistogram()
        this.createCarCityCountMap()
        this.createCarLatLngCountMap()

     
    }

    private initBuckets(start: number , end: number, binSize: number) {
        for (let lower = start; lower <= end; lower += binSize) {
            const upper = lower + binSize;
            this.speedHistogram.push({
                range : `${lower}-${upper}`,
                count : 0
            })
        }
    }

    private addCarToBucket(speed : number) {
        for (let i = 0; i < this.speedHistogram.length; i++) {
            const [low, high] = this.speedHistogram[i].range.split("-").map(Number);

            if (speed >= low && speed < high) {
                this.speedHistogram[i].count++;
                break; // stop once the right bucket is found
            }
            }
        }

    private createSpeedHistogram() {
        
        this.speedHistogram = []
        this.initBuckets(0,280,20)
  
        for (const [carId, car] of this.cars.entries()) {
            this.addCarToBucket(car.speed)
        }

    }

    private filterTopTenCarBySpeed() {
        this.topTenCarsBySpeed = [...this.cars.entries()]
    .sort((a, b) => b[1].speed - a[1].speed) // sort descending by speed
    .slice(0, 10)
   
    }

    private createCarCityCountMap() {
        this.carCountByCity = new Map()
        for (const [carId, car] of this.cars.entries()) {
   
            if (this.carCountByCity.has(car.city) && this.carLatAndLngArrByCity.has(car.city)) {
                this.carCountByCity.set(car.city,  (this.carCountByCity.get(car.city) ?? 0) + 1);
                this.carLatAndLngArrByCity.get(car.city)!.push([car.latitude, car.longitude]);
            } else {
                this.carCountByCity.set(car.city, 1);
                this.carLatAndLngArrByCity.set(car.city, [])
            }
        }
    }

    private createCarLatLngCountMap() {
        this.carAggrLatLangByCity = new Map()
        


        for (const [cityName, latLngArr] of this.carLatAndLngArrByCity.entries()) {

            let aggrLat = 0
            let aggrLng = 0

            for (let i=0; i<latLngArr.length; i++) {
                aggrLat += latLngArr[0][0]
                aggrLng += latLngArr[0][1]
            }
            
            let carCountForCity = this.carCountByCity.get(cityName) ?? 1

            this.carAggrLatLangByCity.set(cityName, [(aggrLat/carCountForCity), (aggrLng/carCountForCity)])
        }

    }

}