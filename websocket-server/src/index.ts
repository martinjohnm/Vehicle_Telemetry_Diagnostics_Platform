


import { WebSocketServer } from "ws"
import { SubsciptionManager } from "./SubscriptionManager"

const wss = new WebSocketServer({ port: 3001 })


async function main() {

    while (true) {
        const response = await SubsciptionManager.getInstance().redisClient.rPop("car_telematics" as string)

        console.log(response);
        
    }


}

main()

