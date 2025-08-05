package manager

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"telematics-pusher-golang/model"
	"time"

	"github.com/redis/go-redis/v9"
)


type CarManager struct {
	client *redis.Client
	channel string
	ctx context.Context
}

func NewCarManager(redisAddr, channel string) *CarManager {
	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	return  &CarManager{
		client: rdb,
		channel: channel,
		ctx: context.Background(),
	}
}

func (m *CarManager) PushTelemetry (car model.CarTelemetry) error {
	data, err := json.Marshal(car)

	if err != nil {
		return  err
	}

	return  m.client.Publish(m.ctx, m.channel, data).Err()
}

func (m *CarManager) SimulateAndPush(carID string) {
	for {
		car := model.CarTelemetry{
			ID:        carID,
			Speed:     rand.Float64() * 100,
			Latitude:  rand.Float64()*180 - 90,
			Longitude: rand.Float64()*360 - 180,
			FuelLevel: rand.Float64() * 100,
			Timestamp: time.Now().Unix(),
		}

		err := m.PushTelemetry(car)

		if err != nil {
			log.Println("error pushing to telemetry:", err)
		} else {
			log.Println("published data for car:", car.ID)
		}

		time.Sleep(1 * time.Second)
	}
}

// func (m *CarManager) SimulateAndPushWithContext(ctx context.Context, carID string) {
// 	ticker := time.NewTicker(1 * time.Second)
// 	defer ticker.Stop()

// 	for {
// 		select {
// 		case <-ctx.Done():
// 			log.Println("Stopping telemetry for", carID)
// 			return
// 		case <-ticker.C:
// 			car := model.CarTelemetry{
// 				ID:        carID,
// 				Speed:     rand.Float64() * 100,
// 				Latitude:  rand.Float64()*180 - 90,
// 				Longitude: rand.Float64()*360 - 180,
// 				FuelLevel: rand.Float64() * 100,
// 				Timestamp: time.Now().Unix(),
// 			}

// 			if err := m.PushTelemetry(car); err != nil {
// 				log.Println("Error pushing telemetry:", err)
// 			} else {
// 				log.Println("Published data for car", car.ID)
// 			}
// 		}
// 	}
// }


func (m *CarManager) PushTelemetryPerCar(car model.CarTelemetry) error {
	data, err := json.Marshal(car)
	if err != nil {
		return err
	}

	channel := "car:" + car.ID // unique Redis channel per car
	err = m.client.Publish(m.ctx, channel, string(data)).Err()
	if err != nil {
		log.Printf("Failed to publish telemetry for %s: %v\n", car.ID, err)
		return err
	}

	log.Printf("Published telemetry for %s on channel %s\n", car.ID, channel)
	return nil
}

func (m *CarManager) SimulateAndPushWithContext(ctx context.Context, carID string) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("Stopping telemetry for", carID)
			return
		case <-ticker.C:
			car := model.CarTelemetry{
				ID:        carID,
				Speed:     rand.Float64() * 100,
				Latitude:  rand.Float64()*180 - 90,
				Longitude: rand.Float64()*360 - 180,
				FuelLevel: rand.Float64() * 100,
				Timestamp: time.Now().Unix(),
			}

			if err := m.PushTelemetryPerCar(car); err != nil {
				log.Println("Error pushing telemetry:", err)
			}
		}
	}
}
