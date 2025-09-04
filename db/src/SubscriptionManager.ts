
import { createClient, RedisClientType } from "redis";



export class SubsciptionManager {


    public redisClient : RedisClientType
    public static instance : SubsciptionManager;

    private constructor() {
        this.redisClient = createClient()
        this.redisClient.connect()
        this.createConsumerGroup("telematics_stream", "db-service-group-2")
    }

    public static getInstance () {
        if (!this.instance) {
            this.instance = new SubsciptionManager()
        }

        return this.instance
    }

    public createConsumerGroup(streamKey : string, groupName : string) {
        try {
            this.redisClient.xGroupCreate(streamKey, groupName, "0", { MKSTREAM: true });
        console.log("Consumer group created");
        } catch (err: any) {
        if (err.message.includes("BUSYGROUP")) {
            console.log("Consumer group already exists");
        } else {
            throw err;
        }
        }
    }

    public async readFromTheStream(groupName : string, consumerName : string, streamKey : string) {
        while (true) {
            const response = await this.redisClient.xReadGroup(
            groupName,
            consumerName,
            [{ key: streamKey, id: ">" }], // ">" means only new messages
            { COUNT: 10, BLOCK: 5000 }    // batch size + block timeout
            );

            if (response) {
            for (const stream of response) {
                for (const message of stream.messages) {
                const id = message.id;
                const values = message.message;

                console.log("Received:", id, values);

                // TODO: Save to DB
            
                // Acknowledge processing
                await this.redisClient.xAck(streamKey, groupName, id);
                }
            }

            }
        }
    }

    public subscribe(userId : string, subscription : string) {
        this.redisClient.subscribe(subscription, function redisCallBackHandler(message : string, channel : string) {
            const parsedMessage = JSON.parse(message);
            console.log(parsedMessage);
            
        })
    }
}