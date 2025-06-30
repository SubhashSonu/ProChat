import { useEffect, useState } from "react";
import useChatStore from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import useAuthStore from "../store/useAuthStore";
import { useRef } from "react";
import { formatMessageTime } from "../lib/utils";
import { CircleX } from "lucide-react";


const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading ,selectedUser,subscribeToMessages, unsubscribeFromMessages} = useChatStore();

  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);
  
  const [imagePreview,setImagePreview] = useState(null);


   useEffect(() => { 
   getMessages(selectedUser._id);
   subscribeToMessages();

   return () => unsubscribeFromMessages();
  }, [selectedUser._id,getMessages,subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
  if (messageEndRef.current) {
    messageEndRef.current.scrollIntoView({ behavior: "auto" });
  }
}, [messages]);


  if(isMessagesLoading) return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <MessageSkeleton/>
  </div>

  )

 
  
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">  

                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                
                  onClick={()=> setImagePreview(message.image)}
                />
              )}
              
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setImagePreview(null)}>
          <div className="relative">
            <img
              src={imagePreview}
              className="max-w-[90vw] max-h-[80vh] rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-2 right-2 text-white text-3xl"
              onClick={() => setImagePreview(null)}
            >
             <CircleX/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatContainer;