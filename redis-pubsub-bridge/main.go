
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"

	"github.com/redis/go-redis/v9"
)

type Car struct {
	ID        string  `json:"id"`
	Type      string  `json:"type"`
	City      string  `json:"city"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Speed     float64 `json:"speed"`
	Direction float64 `json:"direction"`
	FuelLevel float64 `json:"fuel_level"`
	Status    string  `json:"status"`
	Timestamp int64   `json:"timestamp"`
}

// ---- config (env-overridable) ----
func getEnv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

var (

	
	redisHost = getEnv("REDIS_HOST", "127.0.0.1")
    redisPort = getEnv("REDIS_PORT", "6379")
    redisAddr = fmt.Sprintf("%s:%s", redisHost, redisPort) // combine host and port
	redisPass    = getEnv("REDIS_PASS", "")
	pubsubChan   = getEnv("PUBSUB_CHANNEL", "cars:data")
	streamName   = getEnv("STREAM_NAME", "telematics_stream")
	maxlenApprox = int64(100000) // trim stream approximately
	workers      = func() int {
		if v := os.Getenv("WORKERS"); v != "" {
			var n int
			fmt.Sscanf(v, "%d", &n)
			if n > 0 {
				return n
			}
		}
		return runtime.NumCPU() * 4
	}()
	jobQueueSize = 8192
)

// parseCars tries array then map[string]Car
func parseCars(raw []byte) ([]Car, error) {
	// try: array
	var arr []Car
	if err := json.Unmarshal(raw, &arr); err == nil && len(arr) > 0 {
		return arr, nil
	}
	// try: map
	var m map[string]Car
	if err := json.Unmarshal(raw, &m); err == nil && len(m) > 0 {
		out := make([]Car, 0, len(m))
		for _, c := range m {
			out = append(out, c)
		}
		return out, nil
	}
	// try: map[string]map[string]interface{} (very loose) -> minimal projection
	var mm map[string]map[string]interface{}
	if err := json.Unmarshal(raw, &mm); err == nil && len(mm) > 0 {
		out := make([]Car, 0, len(mm))
		for _, v := range mm {
			c := Car{}
			if s, ok := v["id"].(string); ok {
				c.ID = s
			}
			if s, ok := v["type"].(string); ok {
				c.Type = s
			}
			if s, ok := v["city"].(string); ok {
				c.City = s
			}
			if f, ok := v["latitude"].(float64); ok {
				c.Latitude = f
			}
			if f, ok := v["longitude"].(float64); ok {
				c.Longitude = f
			}
			if f, ok := v["speed"].(float64); ok {
				c.Speed = f
			}
			if f, ok := v["direction"].(float64); ok {
				c.Direction = f
			}
			if f, ok := v["fuel_level"].(float64); ok {
				c.FuelLevel = f
			}
			if s, ok := v["status"].(string); ok {
				c.Status = s
			}
			switch t := v["timestamp"].(type) {
			case float64:
				c.Timestamp = int64(t)
			case int64:
				c.Timestamp = t
			}
			out = append(out, c)
		}
		return out, nil
	}
	return nil, fmt.Errorf("unsupported JSON shape")
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// graceful shutdown
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sig
		log.Println("signal received, shutting down...")
		cancel()
	}()

	// redis client
	rdb := redis.NewClient(&redis.Options{
		Addr:         redisAddr,
		Password:     redisPass,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		PoolSize:     20,
	})
	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Fatalf("redis ping: %v", err)
	}

	// subscribe
	pubsub := rdb.Subscribe(ctx, pubsubChan)
	defer pubsub.Close()

	// worker pool
	type job struct {
		Car Car
	}
	jobs := make(chan job, jobQueueSize)
	done := make(chan struct{})

	for i := 0; i < workers; i++ {
		go func(id int) {
			for j := range jobs {
				// Prepare XADD values
				values := map[string]interface{}{
					"id":        j.Car.ID,
					"type":      j.Car.Type,
					"city":      j.Car.City,
					"latitude":       j.Car.Latitude,
					"longitude":       j.Car.Longitude,
					"speed":     j.Car.Speed,
					"direction": j.Car.Direction,
					"fuel":      j.Car.FuelLevel,
					"status":    j.Car.Status,
					"timestamp":        j.Car.Timestamp,
				}
				// XADD with approximate trim
				_ = rdb.XAdd(ctx, &redis.XAddArgs{
					Stream: streamName,
					MaxLen: maxlenApprox,
					Approx: true,
					Values: values,
				}).Err()
				// (optional) handle/log errors:
				// if err != nil { log.Printf("worker %d xadd err: %v", id, err) }
			}
			done <- struct{}{}
		}(i)
	}

	log.Printf("bridge up. pubsub=%s -> stream=%s workers=%d", pubsubChan, streamName, workers)

	// main consume loop
	ch := pubsub.Channel(redis.WithChannelHealthCheckInterval(0)) // no extra pings
	for {
		select {
		case <-ctx.Done():
			close(jobs)
			// wait workers
			for i := 0; i < workers; i++ {
				<-done
			}
			log.Println("bye")
			return

		case msg, ok := <-ch:
			if !ok {
				log.Println("pubsub channel closed")
				cancel()
				continue
			}
			// one big JSON payload -> parse into cars
			cars, err := parseCars([]byte(msg.Payload))
			if err != nil {
				log.Printf("parseCars error: %v (payload len=%d)", err, len(msg.Payload))
				continue
			}
			// enqueue jobs (backpressure via buffered chan)
			for _, c := range cars {
				select {
				case jobs <- job{Car: c}:
				case <-ctx.Done():
					break
				}
			}
			log.Printf("enqueued %d cars from message", len(cars))
		}
	}
}
