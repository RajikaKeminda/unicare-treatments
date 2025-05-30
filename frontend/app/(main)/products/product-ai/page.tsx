'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  id: number;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const [showThinking, setShowThinking] = useState(false);
  const [thinkingDots, setThinkingDots] = useState('');

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, typingText, showThinking]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showThinking) {
      let dotCount = 0;
      interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        setThinkingDots('.'.repeat(dotCount));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [showThinking]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        sendMessage(input);
      }
    }
  };

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      sender: 'user',
      text: userInput,
      id: messageIdRef.current++,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowThinking(true);

    const apiKey = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_OPENROUTER_API_KEY as string) : '';

    if (!apiKey) {
      const missingKeyMessage: Message = {
        sender: 'bot',
        text: "API key is missing! ❌ Please ask Pulindu to provide the API key and add it to the .env frontend file. 🚀",
        id: messageIdRef.current++,
      };
      setMessages((prev) => [...prev, missingKeyMessage]);
      setIsLoading(false);
      setTypingText('');
      setShowThinking(false);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: userInput }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Unknown error");
      }

      const data = await response.json();

      const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                              "I'm sorry, I didn't understand that.";

      await typeBotMessage(botResponseText);
    } catch (error) {
      console.error('API error:', error);
      let errorMessage = "Oops! Something went wrong.";
      if (error instanceof Error) {
        if (error.message.includes("quota")) {
          errorMessage = "You have exceeded your usage limit. Please try again later.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "The request timed out. Please try again later.";
        } else {
          errorMessage = "There was an issue with the API. Please try again later.";
        }
      }
      const errorBotMessage: Message = {
        sender: 'bot',
        text: errorMessage,
        id: messageIdRef.current++,
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
      setTypingText('');
      setShowThinking(false);
    }
  };

  const typeBotMessage = async (fullText: string) => {
    setTypingText('');
    setShowThinking(false);
    let currentText = '';
    for (let i = 0; i < fullText.length; i++) {
      currentText += fullText[i];
      setTypingText(currentText);
      await new Promise((resolve) => setTimeout(resolve, 15));
    }

    const botMessage: Message = {
      sender: 'bot',
      text: fullText,
      id: messageIdRef.current++,
    };
    setMessages((prev) => [...prev, botMessage]);
    setTypingText('');
  };

  const handleButtonClick = () => {
    if (!isLoading) {
      sendMessage(input);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[100px] bg-gradient-to-br from-gray-50 to-gray-100 p-9">
      <div className="flex flex-col w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-500 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Product Assistant</h1>
              <p className="text-xs opacity-80">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 p-6 overflow-y-auto bg-gray-50 relative">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-center max-w-md">Ask me anything and I&apos;ll do my best to help!</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-red-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`} style={{ wordBreak: 'break-word' }}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {showThinking && (
                <div className="flex mb-4 justify-start animate-fadeIn">
                  <div className="max-w-2xl bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                    <p className="whitespace-pre-wrap">Thinking{thinkingDots}</p>
                  </div>
                </div>
              )}
              {typingText && (
                <div className="flex mb-4 justify-start">
                  <div className="max-w-2xl bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                    <p className="whitespace-pre-wrap">{typingText}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center bg-gray-100 p-4">
          <textarea
            className="flex-1 p-2 border-2 border-gray-300 rounded-lg resize-none"
            rows={2}
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className={`ml-4 p-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-lg`}
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
