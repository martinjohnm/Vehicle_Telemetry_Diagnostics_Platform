package main

import (
	"context"
	"db-go-service/config"
	"db-go-service/internal"
	"fmt"
	"log"
)

const (
	batchSize  = 100
	numWorkers = 3
)

func main() {
	ctx := context.Background()
	cfg := config.Load()

	// DB
	db := internal.ConnectDB(ctx, cfg.DBUrl)
	defer db.Close()
	internal.InitSchema(ctx, db)

	// Redis
	rdb := internal.NewRedis(cfg.RedisAddr)
	internal.EnsureGroup(ctx, rdb, cfg.StreamKey, cfg.GroupName)

	// Workers
	for i := 0; i < numWorkers; i++ {
		go internal.StartWorker(ctx, rdb, db, cfg.StreamKey, cfg.GroupName, fmt.Sprintf("worker-%d", i), batchSize)
	}

	log.Println("db go Service running...")
	select {}
}
