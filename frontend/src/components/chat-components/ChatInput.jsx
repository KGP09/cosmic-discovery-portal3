import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() !== "") {
      onSend(input);

      setInput("");
    }
  };

  return (
    <div className="flex items-center bg-gray-800 p-2 rounded-md">
      <input
        type="text"
        className="flex-1 p-2 bg-transparent text-white outline-none"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
