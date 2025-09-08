// model/car.go
package model

import (
	"math"
	"math/rand"
)

type CarTelemetry struct {

	Type      string  `json:"type"`

	ID        string  `json:"id"`
	City      string  `json:"city"`
	Speed     float64 `json:"speed"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	FuelLevel float64 `json:"fuel_level"`
	Direction float64 `json:"direction"`
	Status    string  `json:"status"`
	Timestamp int64   `json:"timestamp"`
}



const earthRadiusKm = 6371.0


func MoveCar(c CarTelemetry, tickSeconds float64) CarTelemetry {
	// calculate the distance treavelled in this tick
	distaceKm := c.Speed *tickSeconds / 3600.0


	// convert direction to radians
	directionRad := c.Direction * math.Pi / 180.0

	// calculate new latitude
	newLat := c.Latitude + (distaceKm/earthRadiusKm) * (180/math.Pi) * math.Cos(directionRad)

	newLong := c.Longitude + (distaceKm/earthRadiusKm) * (180/math.Pi) * math.Sin(directionRad)

	c.Latitude = newLat
	c.Longitude = newLong

	return  c
}


func UpdateSpeedAndDirection(c CarTelemetry) CarTelemetry {
	// Randomly adjust speed +/- 10 km/h, keep between 0 and 120 km/h
	c.Speed += float64(randomSpeedChange())

	if c.Speed <0{
		c.Speed = 0
	} 
	if c.Speed >= 120 {
		c.Speed += float64(randomSpeedChange())
	}

	// Randomlly adjust direction +/- 15 degrees, keep within 0-360
	c.Direction += (rand.Float64()*30-15)
	if c.Direction < 0 {
		c.Direction += 360
	}

	if c.Direction >= 360 {
		c.Direction -= 360
	}

	// update status based on speed

	if c.Speed == 0 {
		c.Status = "idle"
	} else if c.Speed < 10 {
		c.Status = "stopped"
	} else {
		c.Status = "moving"
	}


	// fuel level 
	if c.FuelLevel < 5{
		c.FuelLevel = 100
	} else {
		c.FuelLevel -= 0.4 
	}


	return c
}

// randomSpeedChange returns a random change in speed
func randomSpeedChange() int {
	// 80% chance small change, 20% chance big change
	if rand.Intn(100) < 80 {
		// ±1–2 km/h
		return randSign() * (1 + rand.Intn(2))
	} else {
		// ±5–7 km/h
		return randSign() * (5 + rand.Intn(3))
	}
}

// randSign returns +1 or -1 randomly
func randSign() int {
	if rand.Intn(2) == 0 {
		return -1
	}
	return 1
}