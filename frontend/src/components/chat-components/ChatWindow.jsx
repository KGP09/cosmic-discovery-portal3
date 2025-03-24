import React, { useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useAIStore } from "../../store/useAIStore";

const ChatWindow = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    setMessages([]);
    setImages([]);
  }, [selectedChat]);

  const { getAIChat, getImages } = useAIStore();

  const handleSend = async (message) => {
    setMessages([...messages, { text: message, sender: "user" }]);

    if (selectedChat === "ai") {
      console.log("AI:", message);
      const res = await getAIChat({ query: message });
      const intel = res.data.data.choices[0].message.content;
      console.log(intel);
      setMessages((prev) => [...prev, { text: intel, sender: "bot" }]);
    } else {
      console.log("Images:", message);
      const res = await getImages({ query: message });
      const trimmedImages = res.data.data.length > 10 ? res.data.data.slice(0, 10) : res.data.data;
      setImages(trimmedImages);
      console.log(trimmedImages);
    }
  };

  return (
    <div className="flex flex-col justify-between w-[80%] bg-[#0f1626] p-4">
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, index) => (
          <MessageBubble key={index} selectedChat={selectedChat} text={msg.text} sender={msg.sender} />
        ))}
        {images.map((img, index) => (
          <MessageBubble key={index} selectedChat={selectedChat} image={img.links[0].href} sender="bot" />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
