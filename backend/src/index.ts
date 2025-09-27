


import express from "express"
import cors from "cors";

import { carRouter } from "./routes/car"


const app = express()
// Allow requests from React dev server (port 5173)



app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you want to send cookies
}));
app.use(express.json())

app.use("/api/v1/car", carRouter)

const port = Number(process.env.PORT) ?? 3003

app.listen(port, () => {
    console.log("server is running on 3003");
    
})