import { Cars } from "./Cars";



export class CarsManager {
    private static instance : CarsManager;
    private cars: Map<string, Cars> = new Map()

    private constructor() {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new CarsManager()
        }

        return this.instance
    }
}