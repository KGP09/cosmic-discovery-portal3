import React from "react";
import { FaRocket, FaImages } from "react-icons/fa";

const Sidebar = ({ selectedChat, setSelectedChat }) => {
  return (
    <div className="w-[20%] p-4 flex flex-col bg-[#1a2238] border-r border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-center">Cosmic Chat</h2>
      <button
        className={`flex items-center px-4 py-3 rounded-md transition-all ${
          selectedChat === "ai" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-300"
        }`}
        onClick={() => setSelectedChat("ai")}
      >
        <FaRocket className="mr-2" />
        AI Chatbot
      </button>

      <button
        className={`flex items-center px-4 py-3 mt-2 rounded-md transition-all ${
          selectedChat === "imageExplorer" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-300"
        }`}
        onClick={() => setSelectedChat("imageExplorer")}
      >
        <FaImages className="mr-2" />
        Image Explorer
      </button>
    </div>
  );
};

export default Sidebar;
