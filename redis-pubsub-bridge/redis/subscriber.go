package redis

import (
	"context"
	"encoding/json"
	"log"

	"github.com/redis/go-redis/v9"
)


type Car struct {
    ID    string  `json:"id"`
    Speed int     `json:"speed"`
    Lat   float64 `json:"lat"`
    Lon   float64 `json:"lon"`
}

type PubSubMessage struct {
    Cars []Car `json:"cars"`
}


func SubscribeAndForward(ctx context.Context, rdb *redis.Client, channel, stream string) {
    pubsub := rdb.Subscribe(ctx, channel)
    ch := pubsub.Channel()



    log.Printf("Subscribed to pattern: %s", channel)

    for {
        select {
        case <-ctx.Done():
            return
        case msg := <-ch:
            // Each msg.Channel is the car channel
       
            var cars map[string]map[string]interface{}
            if err := json.Unmarshal([]byte(msg.Payload), &cars); err != nil {
                log.Printf("Failed to parse payload: %v", err)
                continue
            }
        
            for carID, carData := range cars {
                entry := map[string]interface{}{
                    "car_id": carID,
                }

                // Flatten carData into entry
                for k, v := range carData {
                    entry[k] = v
                }

                data, err := json.Marshal(entry)

                if err != nil {
                    log.Printf("Json error in car")
                }

                if err := PushToStream(ctx, rdb, stream, data); err != nil {
                    log.Printf("Failed to push car %s to stream: %v", carID, err)
                }
            }
            // data := map[string]interface{}{
            //     "car_channel": msg.Channel,
            //     "payload":     msg.Payload,
            // }


            

            // if err := PushToStream(ctx, rdb, stream, data); err != nil {
            //     log.Printf("Failed to push to stream: %v", err)
            // }
        }
    }


    // // with single for loop push

    // for msg := range ch {
    //     var payload PubSubMessage
    //     if err := json.Unmarshal([]byte(msg.Payload), &payload); err != nil {
    //         log.Println("Unmarshal error:", err)
    //         continue
    //     }

    //     for _, car := range payload.Cars {
    //         _, err := rdb.XAdd(ctx, &redis.XAddArgs{
    //             Stream: stream,
    //             Values: map[string]interface{}{
    //                 "id" : car.ID,
    //                 "speed" : car.Speed,
    //                 "lat" : car.Lat,
    //                 "lon" : car.Lon,
    //             },
    //         }).Result()

    //         if err != nil {
    //             log.Println("Xadd error")
    //         }
    //     }
    // }





    // with go routines 
    // for msg := range ch {
    // var payload PubSubMessage
    // if err := json.Unmarshal([]byte(msg.Payload), &payload); err != nil {
    //     log.Println("Unmarshal error:", err)
    //     continue
    // }

    // wg := sync.WaitGroup{}
    // for _, car := range payload.Cars {
    //         wg.Add(1)
    //         go func(c Car) {
    //             defer wg.Done()
    //             _, err := rdb.XAdd(ctx, &redis.XAddArgs{
    //                 Stream: "car:telemetry",
    //                 Values: map[string]interface{}{
    //                     "id":    c.ID,
    //                     "speed": c.Speed,
    //                     "lat":   c.Lat,
    //                     "lon":   c.Lon,
    //                 },
    //             }).Result()
    //             if err != nil {
    //                 log.Println("XAdd error:", err)
    //             }
    //         }(car)
    //     }
    //     wg.Wait() // wait until all cars in this Pub/Sub msg are written
    // }


    // with worker pool 
        //     const workerCount = 50
        // jobs := make(chan Car, 1000) // queue of cars
        // wg := sync.WaitGroup{}

        // // Start workers
        // for i := 0; i < workerCount; i++ {
        //     go func() {
        //         for car := range jobs {
        //             _, err := rdb.XAdd(ctx, &redis.XAddArgs{
        //                 Stream: "car:telemetry",
        //                 Values: map[string]interface{}{
        //                     "id":    car.ID,
        //                     "speed": car.Speed,
        //                     "lat":   car.Lat,
        //                     "lon":   car.Lon,
        //                 },
        //             }).Result()
        //             if err != nil {
        //                 log.Println("XAdd error:", err)
        //             }
        //             wg.Done()
        //         }
        //     }()
        // }

        // // Consume Pub/Sub
        // for msg := range ch {
        //     var payload PubSubMessage
        //     if err := json.Unmarshal([]byte(msg.Payload), &payload); err != nil {
        //         log.Println("Unmarshal error:", err)
        //         continue
        //     }

        //     for _, car := range payload.Cars {
        //         wg.Add(1)
        //         jobs <- car
        //     }
        // }

}