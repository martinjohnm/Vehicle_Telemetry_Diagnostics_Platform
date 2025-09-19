import { Request, Response, Router } from "express";
import { Client } from "pg";

import dotenv from "dotenv";

// Load env variables from .env into process.env
dotenv.config();


const pgClient = new Client({
    user    : process.env.DB_USER,
    host    : process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port    : Number(process.env.DB_PORT)

})
pgClient.connect();


export const carRouter = Router()


carRouter.get("/", async (req,res) => {
    res.json({

        hai : "hai"
    })
})


carRouter.get("/1m/:id", async (req : Request,res : Response) => {


    try {
        const { id } = req.params;
        // SELECT bucket, avg_speed FROM car_speed_1m where id='CAR-123' and bucket >= NOW() - interval '2 days';
        let query = `SELECT * FROM car_speed_1m WHERE bucket >= $1 AND bucket <= $2 and id='${id}'`;

        const result = await pgClient.query(query, [new Date("2025-09-15T00:00:00Z"), new Date()])

        return res.json({
            result : result.rows
        })
        
    } catch(e) {

    }
    
})

carRouter.get("/5m/:id", async (req : Request,res : Response) => {


    try {
        const { id } = req.params;
        // SELECT bucket, avg_speed FROM car_speed_1m where id='CAR-123' and bucket >= NOW() - interval '2 days';
        let query = `SELECT * FROM car_speed_5m WHERE bucket >= $1 AND bucket <= $2 and id='${id}'`;

        const result = await pgClient.query(query, [new Date("2025-09-15T00:00:00Z"), new Date()])

        return res.json({
            result : result.rows
        })
        
    } catch(e) {

    }
    
})


carRouter.get("/10m/:id", async (req : Request,res : Response) => {


    try {
        const { id } = req.params;
        // SELECT bucket, avg_speed FROM car_speed_1m where id='CAR-123' and bucket >= NOW() - interval '2 days';
        let query = `SELECT * FROM car_speed_10m WHERE bucket >= $1 AND bucket <= $2 and id='${id}'`;

        const result = await pgClient.query(query, [new Date("2025-09-15T00:00:00Z"), new Date()])

        return res.json({
            result : result.rows
        })
        
    } catch(e) {

    }
    
})


carRouter.get("/15m/:id", async (req : Request,res : Response) => {


    try {
        const { id } = req.params;
        // SELECT bucket, avg_speed FROM car_speed_1m where id='CAR-123' and bucket >= NOW() - interval '2 days';
        let query = `SELECT * FROM car_speed_15m WHERE bucket >= $1 AND bucket <= $2 and id='${id}'`;

        const result = await pgClient.query(query, [new Date("2025-09-15T00:00:00Z"), new Date()])

        return res.json({
            result : result.rows
        })
        
    } catch(e) {

    }
    
})


carRouter.get("/30m/:id", async (req : Request,res : Response) => {


    try {
        const { id } = req.params;
        // SELECT bucket, avg_speed FROM car_speed_1m where id='CAR-123' and bucket >= NOW() - interval '2 days';
        let query = `SELECT * FROM car_speed_30m WHERE bucket >= $1 AND bucket <= $2 and id='${id}'`;

        const result = await pgClient.query(query, [new Date("2025-09-15T00:00:00Z"), new Date()])

        return res.json({
            result : result.rows
        })
        
    } catch(e) {

    }
    
})


carRouter.get("/1h/:id", async (req : Request,res : Response) => {


    try {
        const { id } = req.params;
        // SELECT bucket, avg_speed FROM car_speed_1m where id='CAR-123' and bucket >= NOW() - interval '2 days';
        let query = `SELECT * FROM car_speed_1h WHERE bucket >= $1 AND bucket <= $2 and id='${id}'`;

        const result = await pgClient.query(query, [new Date("2025-09-15T00:00:00Z"), new Date()])

        return res.json({
            result : result.rows
        })
        
    } catch(e) {

    }
    
})