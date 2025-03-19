import express from "express";
import dotenv from "dotenv";
import aiRoutes from "../backend/routes/ai.routes.js"
dotenv.config()
const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use('/api/ai', aiRoutes)
app.listen(PORT, () => {
    console.log("Listening to the PORT ", PORT);
})