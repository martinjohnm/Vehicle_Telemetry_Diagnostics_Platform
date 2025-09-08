package redis

import (
    "context"
    "github.com/redis/go-redis/v9"
)

func PushToStream(ctx context.Context, rdb *redis.Client, stream string, data interface{}) error {
    return rdb.XAdd(ctx, &redis.XAddArgs{
        Stream: stream,
        MaxLen: 1_000_000,
        Values: data,
    }).Err()
}
