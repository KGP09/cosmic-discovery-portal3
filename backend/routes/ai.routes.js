import express from "express"
import { chatBot, getImages } from "../controllers/ai.controller.js"
const router = express.Router()

router.post('/get-images', getImages)
router.post('/ask-chatbot', chatBot)
export default router
