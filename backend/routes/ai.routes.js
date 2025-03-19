import express from "express"
import { chatBot, getImages } from "../controllers/ai.controller.js"
const router = express.Router()

router.get('/get-images', getImages)
router.get('/ask-chatbot', chatBot)
export default router
