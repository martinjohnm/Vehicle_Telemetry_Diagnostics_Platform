package main

import (
	"fmt"
	"log"
	"telematics-pusher-golang/manager"
	"time"
)


func main() {
	log.Println("Starting Car Telematics Pusher Service for 5000 cars...")

	carManager := manager.NewCarManager("localhost:6379", "car:telemetry")
	

	 // Load data from the file
    if err := carManager.LoadFromJSON("cars_5000_germany_neighbours.json"); err != nil {
        fmt.Println("Error loading data:", err)
        return
    }

	totalCars := 5000

	// Run updates every 1 second
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		for i := 1; i <= totalCars; i++ {
			carID := fmt.Sprintf("CAR-%d", i)
			carManager.UpdateTelematics(carID)
		}

		carManager.PushAllTelemetry()
	}
}



// func main() {
// 	log.Println("Starting Car Telematics Pusher Service for 5000 cars...")

// 	carManager := manager.NewCarManager("localhost:6379", "car:telemetry")
	

// 	 // Load data from the file
//     if err := carManager.LoadFromJSON("cars_5000_germany_neighbours.json"); err != nil {
//         fmt.Println("Error loading data:", err)
//         return
//     }

// 	ctx, cancel := context.WithCancel(context.Background())
// 	defer cancel()


// 	// one instacne of the wg 
// 	var wg sync.WaitGroup
// 	totalCars := 5000

// 	for i := 1; i <= totalCars; i++ {
		
// 		// Each time before lauching goroutine increasing an internal counter for 5000 cars, wg.Add(1) will be called 5000 times and counter become 5000
// 		// and inside each goroutine mark it as done wg.Done()
// 		//It does not create a new WaitGroup. Instead, it tells the same wg:
//  		// "Hey, I'm launching one more goroutine, so wait for one more job to finish before you consider us done."
// 		wg.Add(1)
// 		carID := fmt.Sprintf("CAR-%d", i)

// 		go func(id string) {
// 			// mark the waitgroup as done
// 			defer wg.Done()
// 			// This decrements the internal counter by 1.
// 			carManager.SimulateAndPushWithContext(ctx, carID)
			
// 		}(carID)
// 		fmt.Println(carManager.Telemetry)
// 	}

// 	// Run for 10 seconds then stop all goroutines
// 	time.Sleep(10000 * time.Second)
// 	cancel()

// 	// wait for all to finish
// 	wg.Wait()
// 	// This blocks the program until the counter becomes 0 — i.e., all .Done() calls have completed.

// 	log.Println("Stopped all car telemetry pushes")
// }




// Important: You’re using the same WaitGroup, not one per goroutine
// You don't need (and should not) create a new WaitGroup for every goroutine. That would defeat the purpose. Instead:

// One WaitGroup tracks multiple goroutines.

// Add(1) tells it “one more is coming.”

// Done() tells it “one is finished.”

// Wait() waits until all are done.

// WaitGroup is concurrent-safe, so you can call Add, Done, and Wait from different goroutines.



// Think of it like a counter for how many kids went out to play.

// Add(1) — one kid went out.

// Done() — one kid came back.

// Wait() — parent waits until all kids are home.

