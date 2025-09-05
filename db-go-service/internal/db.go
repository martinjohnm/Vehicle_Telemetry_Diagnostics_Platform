package internal

import (
	"context"
	"log"

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
	log.Println("✅ Timescale hypertable ready")
}
