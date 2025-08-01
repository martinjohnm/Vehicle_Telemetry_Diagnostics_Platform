package main

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

type TelematicsData struct {
	CarID    int     `json:"car_id"`
	Speed    float64 `json:"speed"`
	Lat      float64 `json:"lat"`
	Lon      float64 `json:"lon"`
	Timestamp int64  `json:"timestamp"`
}

func generateCarData(carID int) TelematicsData {
	return TelematicsData{
		CarID:    carID,
		Speed:    rand.Float64()*150.0 + 1,
		Lat:      40.0 + rand.Float64()*20.0,
		Lon:      5.0 + rand.Float64()*20.0,
		Timestamp: time.Now().Unix(),
	}
}

func startPushing(client *redis.Client, carID int) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		data := generateCarData(carID)
		jsonData, err := json.Marshal(data)
		if err != nil {
			fmt.Printf("Car %d: JSON marshal error: %v\n", carID, err)
			continue
		}

		err = client.LPush(ctx, "car_telematics", jsonData).Err()
		if err != nil {
			fmt.Printf("Car %d: Redis push error: %v\n", carID, err)
		}
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())

	client := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	carCount := 5000
	for carID := 1; carID <= carCount; carID++ {
		go startPushing(client, carID)
	}

	select {} // block forever
}
