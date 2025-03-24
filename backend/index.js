import express from "express";
import dotenv from "dotenv";
import aiRoutes from "../backend/routes/ai.routes.js"
import authRoutes from "../backend/routes/auth.routes.js"
import { connectDB } from "./lib/db.js";
import cors from "cors"
import cookieParser from "cookie-parser";
dotenv.config()
const PORT = process.env.PORT
const app = express()
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.listen(PORT, () => {
    console.log("Listening to the PORT ", PORT);
    connectDB()
})
