package internal

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
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

				// val := msg.Values["payload"]
				// fmt.Println(val)

				if detailsStr, ok := msg.Values["payload"].(string); ok {
					var details map[string]interface{}
					if err := json.Unmarshal([]byte(detailsStr), &details); err != nil {
						log.Fatal("Error decoding details:", err)
					}

					// fmt.Println(details)
					// unixTs := int64(details["timestamp"])             // your value
					// t := time.Unix(unixTs, 0).UTC()         // convert to time.Time in UTC

					tsFloat, ok := details["timestamp"].(float64)
					if !ok {
						log.Fatal("timestamp is not a float64")
					}

					t := time.Unix(int64(tsFloat), 0).UTC()


					args = append(args, details["id"],details["speed"],details["latitude"], details["longitude"],details["direction"], t)
					// Now you can access inner fields
					// fmt.Println("Speed:", details["speed"])
					// fmt.Println("Location:", details["location"])
				}
				ids = append(ids, msg.ID)
			
				placeholders = append(placeholders,
					fmt.Sprintf("($%d,$%d,$%d,$%d,$%d,$%d)", i*6+1, i*6+2, i*6+3, i*6+4, i*6+5, i*6+6))
				
				i++
			}
		}


		sql := "INSERT INTO car_data (id,speed,latitude,longitude,direction,timestamp) VALUES " + strings.Join(placeholders, ",")
	
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
