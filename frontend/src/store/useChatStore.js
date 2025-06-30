import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";


const useChatStore = create((set,get)=>({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async()=>{
       set({ isUsersLoading:true });
       try {
        const res = await axiosInstance.get("/messages/users");
        set({ users: res.data });
       } catch (error) {
        toast.error(error.response.data.message);
       } finally{
        set({ isUsersLoading: false });
       }

    },

    getMessages: async(userId)=>{
        set({ isMessagesLoading: true });
        try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data});
        } catch (error) {
        toast.error(error.response.data.message);
        } finally{
             set({ isMessagesLoading: false });
        }
    },

    sendMessage: async(messageData)=>{
            const { selectedUser, messages} = get();
            try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages: [...messages,res.data]});
            } catch (error) {
                toast.error(error.response.data.message);
            }
    },

    subscribeToMessages: ()=>{

        const socket = useAuthStore.getState().socket;
        const selectedUser = get().selectedUser;
         if (!socket || !selectedUser) return;


         socket.off("newMessage");

        socket.on("newMessage", (newMessage)=>{
           const currentSelectedUser = get().selectedUser;
        if (!currentSelectedUser) return;

        if (newMessage.senderId !== currentSelectedUser._id) return;

        set((state) => ({
            messages: [...state.messages, newMessage],
        }));
        })
    },

    unsubscribeFromMessages: ()=>{
          const socket = useAuthStore.getState().socket;
          socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    

}))


export default useChatStore;