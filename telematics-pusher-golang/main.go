package main

import (
	"context"
	"fmt"
	"log"
	"sync"
	"telematics-pusher-golang/manager"
	"time"
)

func main() {
	log.Println("Starting Car Telematics Pusher Service for 5000 cars...")

	carManager := manager.NewCarManager("localhost:6379", "car:telemetry")
	
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var wg sync.WaitGroup
	totalCars := 5000

	for i := 1; i <= totalCars; i++ {
		wg.Add(1)
		carID := fmt.Sprintf("car-%d", i)

		go func(id string) {
			defer wg.Done()
			carManager.SimulateAndPushWithContext(ctx, carID)
		}(carID)
	}

	// Run for 10 seconds then stop all goroutines
	time.Sleep(100 * time.Second)
	cancel()
	wg.Wait()

	log.Println("Stopped all car telemetry pushes")
}
