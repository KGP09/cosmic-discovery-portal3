import React, { useState } from "react";
import Sidebar from "./Sidebar"
import ChatWindow from "./ChatWindow";
const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState("ai"); 
  return (
    <div className="flex flex-col items-center w-full bg-[#0a0f1e] text-white min-h-screen">
      <div className="h-[80px]"></div>
      <div className="flex w-[95%] h-[88vh] rounded-xl shadow-xl overflow-hidden border border-gray-700 bg-[#131a2b]">
        <Sidebar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        <ChatWindow selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default ChatPage;