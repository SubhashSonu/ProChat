import { create } from "zustand";
import axiosInstance from "../lib/axios";


const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({theme});
    }
}));

export default useThemeStore;

