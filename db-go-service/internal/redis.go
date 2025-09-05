package internal

import (
	"context"
	"log"
	"strings"

	rds "github.com/redis/go-redis/v9"
)

func NewRedis(addr string) *rds.Client {
	return rds.NewClient(&rds.Options{Addr: addr})
}

func EnsureGroup(ctx context.Context, rdb *rds.Client, streamKey, groupName string) {
	err := rdb.XGroupCreateMkStream(ctx, streamKey, groupName, "0").Err()
	if err != nil && !strings.Contains(err.Error(), "BUSYGROUP") {
		log.Fatalf("❌ Failed to create group: %v", err)
	}
}
