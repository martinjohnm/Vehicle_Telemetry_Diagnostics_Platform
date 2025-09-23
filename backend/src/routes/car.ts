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


carRouter.get("/speed-data-by-interval", async (req : Request,res : Response) => {


    try {
        const { carId, start, end, interval } = req.query;

        console.log("speed called");
        

        if (!carId || !start || !end || !interval) {
            return res.status(400).json({ error: "Missing required params" });
        }
        const startDate = new Date(start as string);
        const endDate = new Date(end as string);

        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
        }

        let query = `SELECT * FROM car_speed_${interval} WHERE bucket >= $1 AND bucket <= $2 and id= $3`;

        const result = await pgClient.query(query, [startDate, endDate, carId])

        return res.json({
            result : result.rows
        })
        
    } catch(e) {

    }
    
})

carRouter.get("/car-path-by-id", async (req : Request, res : Response) => {
    try {
        const { carId, start, end, interval } = req.query;
        let query = `SELECT latitude, longitude FROM car_data WHERE id = $1 AND timestamp >= NOW() - ($2 * interval '1 minute') ORDER BY timestamp ASC`;

        const result = await pgClient.query(query, [carId, Number(interval)])
        console.log(result.rows.length);
        
        return res.json({
            result : result.rows
        })
        
    } catch(e) {

    }
})


carRouter.get("/distinct", async (req :Request, res : Response) => {
    try {
        let query = `SELECT DISTINCT id
                    FROM car_data
                    ORDER BY id;
                    `   
        const result = await pgClient.query(query)
        return res.json({
            data : result.rows
        })
    } catch(e) {

    }
})