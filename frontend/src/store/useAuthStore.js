import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
export const useAuthStore = create((set) => ({
    authUser: null,
    checkAuth: async () => {
        try {
            const res = axiosInstance.get("/auth/check")
            set({ authUser: (await res).data })
            return true
        } catch (error) {
            console.log("Error in check auth :", error);
            set({ authUser: null })
        }
    },
    login: async (data) => {
        try {
            const res = axiosInstance.post("/auth/login", data)
            set({ authUser: (await res).data })
            return true
        } catch (error) {
            console.log("Error in Login auth :", error);
            set({ authUser: null })
            return false
        }
    },
    signup: async (data) => {
        try {
            const res = axiosInstance.post("/auth/signup", data)
            set({ authUser: (await res).data })
            return true
        } catch (error) {
            console.log("Error in SignUp auth :", error);
            return false
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
        } catch (error) {
            console.log("Error in check auth :", error);
        }
    }
}))