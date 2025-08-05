// model/car.go
package model

type CarTelemetry struct {
	ID        string  `json:"id"`
	Speed     float64 `json:"speed"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	FuelLevel float64 `json:"fuel_level"`
	Timestamp int64   `json:"timestamp"`
}
