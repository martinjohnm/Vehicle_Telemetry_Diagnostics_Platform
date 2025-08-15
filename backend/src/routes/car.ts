import { Router } from "express";



export const carRouter = Router()


carRouter.get("/", async (req,res) => {
    res.json({

        hai : "hai"
    })
})