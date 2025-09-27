package config

import (
	"fmt"
	"os"
)

type Config struct {
	RedisAddr string
	DBUrl     string
	StreamKey string
	GroupName string
}


func Load() Config {

	redisHost:= getEnv("REDIS_HOST", "localhost")
	redisPort:= getEnv("REDIS_PORT", "6379")

	dbHost := getEnv("DB_HOST", "localhost")
    dbPort := getEnv("DB_PORT", "5432")
    dbUser := getEnv("DB_USER", "your_user")
    dbPassword := getEnv("DB_PASSWORD", "your_password")
    dbName := getEnv("DB_NAME", "my_database")

	return Config{
		RedisAddr: fmt.Sprintf("%s:%s", redisHost, redisPort),
		DBUrl:     fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPassword, dbHost, dbPort, dbName),
		StreamKey: getEnv("STREAM_KEY", "telematics_stream"),
		GroupName: getEnv("GROUP_NAME", "db-service-group"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
