


import express from "express"

import { carRouter } from "./routes/car"


const app = express()

app.use(express.json())

app.use("/api/v1/car", carRouter)



app.listen(3003, () => {
    console.log("server is running on 3003");
    
})