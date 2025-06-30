import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "/";


const useAuthStore = create((set, get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth:true,
    updateAction: null,
     onlineUsers : [],
     socket: null,

    checkAuth: async()=>{
        
        try {
        const res = await axiosInstance.get("/auth/check");
        set({authUser:res.data});
        get().connectSocket()

        } catch (error) {
        console.log("Error in checkAuth:",error);
        set({authUser:null})
        } finally{
            set({isCheckingAuth: false});
        }
    },
  
    signup: async(data)=>{
    set({ isSigningUp:true })
    try {
       const res = await axiosInstance.post("/auth/signup",data);

       toast.success("Account created successfully");
       set({authUser: res.data});
       get().connectSocket()


    } catch (error) {
        toast.error(error.response.data.message);
    } finally{
        set({isSigningUp:false})
    }
    },

    login: async(data)=>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
             toast.success("Logged in successfully"); 

             get().connectSocket()

        } catch (error) {
           toast.error(error.response.data.message);
        } finally{
            set({isLoggingIn:false});
        }
    },

    logout: async()=>{
        try {
           await axiosInstance.post("/auth/logout");
           set({authUser: null});
           toast.success("Logged Out successfully");
           get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data)=>{

        set({isUpdatingProfile:true,updateAction: "uploading"});
        try {
            const res = await axiosInstance.put("auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");   
        } catch (error) {
            console.log(error.response.data.message);
        } finally{
            set({isUpdatingProfile:false});
        }
    },
    removeProfilePicture: async () => {
  set({ isUpdatingProfile: true , updateAction: "removing"});
  try {
    const res = await axiosInstance.put("/auth/update-profile", { profilePic: null });
    set({ authUser: res.data });
    toast.success("Profile picture removed");
  } catch (error) {
    console.error("Failed to remove profile picture", error);
    toast.error(error?.response?.data?.message || "Error removing picture");
  } finally {
    set({ isUpdatingProfile: false ,updateAction: null });
  }
},

connectSocket: () =>{
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL,{
        query: {
            userId: authUser._id,
            transports: ["websocket"],
        }
    });

    set({socket : socket});

    socket.on("getOnlineUsers",(userIds)=>{
           set({onlineUsers: userIds});
    });
},
disconnectSocket: () =>{
    if(get().socket?.connected) get().socket.disconnect();
},
    
}))


export default useAuthStore;