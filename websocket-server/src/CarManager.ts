import { WebSocket } from "ws";
import { Car } from "./Car";



export class CarManager {
    private static instance : CarManager;
    private cars: Map<string , Car> = new Map()

    private constructor() {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new CarManager()
        }

        return this.instance
    }

    public addCar(ws : WebSocket) {
        const id =  this.getRandomId();
        const car = new Car()
        this.cars.set(id, car)
        this.registerOnClose(ws, id)
    }

    private registerOnClose(ws: WebSocket, id : string) {
        ws.on("close", () => {
            this.cars.delete(id)
            // subsciptionManager here
        })
    }


    private getRandomId() {
        return Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15)
    }
}