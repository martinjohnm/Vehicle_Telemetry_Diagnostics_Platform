package config

import "os"

type Config struct {
	RedisAddr string
	DBUrl     string
	StreamKey string
	GroupName string
}

func Load() Config {
	return Config{
		RedisAddr: getEnv("REDIS_ADDR", "localhost:6379"),
		DBUrl:     getEnv("DB_URL", "postgres://your_user:your_password@localhost:5432/my_database?sslmode=disable"),
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
