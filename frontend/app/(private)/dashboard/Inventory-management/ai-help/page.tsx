"use client";

import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

const AIHelpChatBox = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputText, setInputText] = useState("");

  // Simulate AI response
  const getAIResponse = (userMessage: string) => {
    // Simulate a delay for AI response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `AI: I received your message - "${userMessage}"`, isUser: false },
      ]);
    }, 1000);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Add user message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `You: ${inputText}`, isUser: true },
      ]);
      // Simulate AI response
      getAIResponse(inputText);
      // Clear input
      setInputText("");
    }
  };

  return (
    <div className="fixed z-[999] bottom-8 right-8 flex flex-col items-end space-y-4">
      {/* Chat Box */}
      <div className="w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-blue-500 text-white p-4 flex items-center space-x-2">
          <FaRobot className="text-xl" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>

        {/* Chat Messages */}
        <div className="h-96 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.isUser ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHelpChatBox;