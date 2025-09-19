


import express from "express"
import cors from "cors";

import { carRouter } from "./routes/car"


const app = express()
// Allow requests from React dev server (port 5173)

console.log("hai ddaa");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you want to send cookies
}));
app.use(express.json())

app.use("/api/v1/car", carRouter)



app.listen(3003, () => {
    console.log("server is running on 3003");
    
})