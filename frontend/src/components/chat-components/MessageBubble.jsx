import React from "react";

const MessageBubble = ({ image, selectedChat, text, sender }) => {
  console.log("bubble:", selectedChat, text);
  return (
<div className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
  <div className={`px-4 py-2 rounded-lg max-w-[50%] 
  ${sender === "user" ? "bg-blue-500 text-white border border-white" : "bg-gray-700 text-gray-300"}`}>
    {(selectedChat === "ai" || text) && <p>{text}</p>}
    {selectedChat === "imageExplorer" && image && (
      <img src={image} alt="Image 404" className="w-40 h-40 object-cover rounded-lg" />
    )}
  </div>
</div>

  );
};

export default MessageBubble;
