package internal

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	rds "github.com/redis/go-redis/v9"
)

func StartWorker(ctx context.Context, rdb *rds.Client, db *pgxpool.Pool, streamKey, group, consumer string, batchSize int64) {
	for {
		res, err := rdb.XReadGroup(ctx, &rds.XReadGroupArgs{
			Group:    group,
			Consumer: consumer,
			Streams:  []string{streamKey, ">"},
			Count:    batchSize,
			Block:    5 * 1e9, // 5s
		}).Result()


	
		if err != nil && err != rds.Nil {
			log.Println("⚠️ XReadGroup error:", err)
			continue
		}

		if len(res) == 0 {
			continue
		}

		
		var ids []string
		var args []interface{}
		var placeholders []string

		i := 0
		for _, stream := range res {
			
			for _, msg := range stream.Messages {

				tsStr, ok := msg.Values["timestamp"].(string)
				if !ok {
					log.Fatal("timestamp is not a string")
				}

				// Convert string → int64
				tsInt, err := strconv.ParseInt(tsStr, 10, 64)
				if err != nil {
					log.Fatal("error parsing timestamp:", err)
				}

				// Convert to time.Time
				t := time.Unix(tsInt, 0).UTC()

				args = append(args, msg.Values["id"],msg.Values["speed"],msg.Values["latitude"], msg.Values["longitude"],msg.Values["direction"],t, msg.Values["city"])
			
				ids = append(ids, msg.ID)
			
				placeholders = append(placeholders,
					fmt.Sprintf("($%d,$%d,$%d,$%d,$%d,$%d, $%d)", i*7+1, i*7+2, i*7+3, i*7+4, i*7+5, i*7+6, i*7+7))
				
				i++
			}
		
		}


		sql := "INSERT INTO car_data (id,speed,latitude,longitude,direction,timestamp, city) VALUES " + strings.Join(placeholders, ",")
	
		_, err = db.Exec(ctx, sql, args...)
		if err != nil {
			log.Println("Insert error:", err)
			continue
		}

		if err := rdb.XAck(ctx, streamKey, group, ids...).Err(); err != nil {
			log.Println("⚠️ XAck error:", err)
		}
		
	}
}
