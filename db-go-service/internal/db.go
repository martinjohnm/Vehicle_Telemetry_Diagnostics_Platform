package internal

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ConnectDB(ctx context.Context, url string) *pgxpool.Pool {
	dbpool, err := pgxpool.New(ctx, url)
	if err != nil {
		log.Fatalf("❌ Failed to connect DB: %v", err)
	}
	return dbpool
}

func InitSchema(ctx context.Context, db *pgxpool.Pool) {
	_, err := db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS car_data (
			id 			TEXT NOT NULL,
			speed 		DOUBLE PRECISION,
			latitude 	DOUBLE PRECISION,
			longitude 	DOUBLE PRECISION,
			direction 	DOUBLE PRECISION,
			timestamp 	TIMESTAMPTZ NOT NULL
		);
	`)
	if err != nil {
		log.Fatal("❌ Create table error:", err)
	}


	_, err = db.Exec(ctx, `
		SELECT create_hypertable('car_data', 'timestamp', if_not_exists => TRUE);
	`)
	if err != nil {
		log.Fatal("❌ Create hypertable error:", err)
	}


	// Start cleanup worker (keep only last 70 minutes of data)
	startCleanupWorker(ctx, db)

	log.Println("✅ Timescale hypertable ready with manual 70m retention")
}

	func startCleanupWorker(ctx context.Context, db *pgxpool.Pool) {
		ticker := time.NewTicker(10 * time.Minute) // run every 1 minute
		go func() {
			for {
				select {
				case <-ticker.C:
					_, err := db.Exec(ctx, `
						DELETE FROM car_data
						WHERE timestamp < NOW() - INTERVAL '70 minutes'
					`)
					if err != nil {
						log.Println("❌ Cleanup error:", err)
					} else {
						log.Println("🧹 Old data cleaned (>70m)")
					}
				case <-ctx.Done():
					log.Println("🛑 Cleanup worker stopped")
					ticker.Stop()
					return
				}
			}
		}()
	log.Println("✅ Timescale hypertable ready")
}
