import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

export const useAIStore = create(() => ({
    getImages: async (data) => {
        try {
            const respone = await axiosInstance.get("/ai/get-images", data)
            return respone
        } catch (error) {
            console.log('AI Store Error : ', error);
        }
    },
    getAIChat: async (data) => {
        try {
            const respone = await axiosInstance.get("/ai/ask-chatbot", data);
            return respone
        } catch (error) {
            console.log('AI Store Error : ', error);

        }
    }
}))