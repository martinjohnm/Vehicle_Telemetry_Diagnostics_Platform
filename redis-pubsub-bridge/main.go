package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	redispkg "github.com/yourname/redis-pubsub-bridge/redis"
)

func main() {
 if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, reading from environment")
    }

    redisAddr := os.Getenv("REDIS_ADDR")
    channelPattern := os.Getenv("CHANNEL_PATTERN")
    stream := os.Getenv("REDIS_STREAM")

    fmt.Println(redisAddr, channelPattern, stream)
    rdb := redis.NewClient(&redis.Options{
        Addr: redisAddr,
    })

    ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
    defer cancel()

    log.Println("Starting Redis Pub/Sub → Stream bridge")
    redispkg.PatternSubscribeAndForward(ctx, rdb, channelPattern, stream)
}
