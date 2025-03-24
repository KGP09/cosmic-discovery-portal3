import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

export const useAIStore = create(() => ({
    selectedChat: null,
    getImages: async (data) => {
        try {
            const respone = await axiosInstance.post("/ai/get-images", data)
            return respone
        } catch (error) {
            console.log('AI Store Error : ', error);
        }
    },
    getAIChat: async (data) => {
        try {
            const respone = await axiosInstance.post("/ai/ask-chatbot", data);
            return respone
        } catch (error) {
            console.log('AI Store Error : ', error);
        }
    }
}))