package redis

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

func PatternSubscribeAndForward(ctx context.Context, rdb *redis.Client, channelPattern, stream string) {
    pubsub := rdb.PSubscribe(ctx, channelPattern)
    ch := pubsub.Channel()

    log.Printf("Subscribed to pattern: %s", channelPattern)

    for {
        select {
        case <-ctx.Done():
            return
        case msg := <-ch:
            // Each msg.Channel is the car channel
            // fmt.Println(msg.Channel, msg.Payload)
            data := map[string]interface{}{
                "car_channel": msg.Channel,
                "payload":     msg.Payload,
            }

            if err := PushToStream(ctx, rdb, stream, data); err != nil {
                log.Printf("Failed to push to stream: %v", err)
            }
        }
    }
}