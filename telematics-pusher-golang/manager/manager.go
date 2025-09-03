package manager

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"os"
	"sync"
	"telematics-pusher-golang/model"
	"time"

	"github.com/redis/go-redis/v9"
)




type CarManager struct {

	mu        	sync.RWMutex
	client 		*redis.Client
	channel 	string
	ctx 		context.Context
	Telemetry 	map[string]*model.CarTelemetry
}

func NewCarManager(redisAddr, channel string) *CarManager {
	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	return  &CarManager{
		client: rdb,
		channel: channel,
		ctx: context.Background(),
		Telemetry: make(map[string]*model.CarTelemetry),
	}
}


type CarData struct {
	
    ID        string    `json:"id"`
    Speed     float64   `json:"speed"`
    Latitude  float64   `json:"lat"`
    Longitude float64   `json:"lng"`
    Timestamp string    `json:"timestamp"`
    City 	  string 	`json:"city"`
}

func (cm *CarManager) LoadFromJSON(filename string) error {

	cm.mu.Lock()
	defer cm.mu.Unlock()

	fileData, err := os.ReadFile(filename)
	if err != nil {
		return  err
	}

    var cars []CarData
    if err := json.Unmarshal(fileData, &cars); err != nil {
        return err
    }

	for _, car := range cars {
        cm.Telemetry[car.ID] = &model.CarTelemetry{
            Speed:      car.Speed,
            Latitude:   car.Latitude,
            Longitude:  car.Longitude,
			City: car.City,
			Direction: 0,
        }
    }
    return nil
}




func (m *CarManager) PushTelemetryPerCar(car model.CarTelemetry) error {
	data, err := json.Marshal(car)
	if err != nil {
		return err
	}

	channel := car.ID // unique Redis channel per car
	err = m.client.Publish(m.ctx, channel, string(data)).Err()
	if err != nil {
		// log.Printf("Failed to publish telemetry for %s: %v\n", car.ID, err)
		return err
	}

	// log.Printf("Published telemetry for %s on channel %s\n", car.ID, channel)
	return nil
}


func (m *CarManager) SimulateAndPushWithContext(ctx context.Context, carID string) {

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	
	// while first time use the data in the json file after that use the previously pushed car state / carTelemetry 
	// implementation pending
	for {
		select {
		case <-ctx.Done():
			log.Println("Stopping telemetry for", carID)
			return
		case <-ticker.C:


			carInit := m.Telemetry[carID]
		

		
			car := model.CarTelemetry{
				Type:      "CAR",	
				ID:        carID,
				Speed:     carInit.Speed,
				Latitude:  carInit.Latitude,
				Longitude: carInit.Longitude,
				Direction: carInit.Direction,
				FuelLevel: rand.Float64() * 100,
				Timestamp: time.Now().Unix(),
				City: carInit.City,
			}

			newcar:= model.MoveCar(car, 1.0)
			finalcar := model.UpdateSpeedAndDirection(newcar)

			m.Telemetry[carID].Speed = finalcar.Speed
			m.Telemetry[carID].Latitude = finalcar.Latitude
			m.Telemetry[carID].Longitude = finalcar.Longitude
			m.Telemetry[carID].Direction = finalcar.Direction
			
			

			if err := m.PushTelemetryPerCar(car); err != nil {
				log.Println("Error pushing telemetry:", err)
			}

			
		}
	}
}
