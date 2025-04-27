'use client'

import React, { useState, useRef, useEffect } from 'react';

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string, text: string, id: number }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessagesAvailable, setNewMessagesAvailable] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  // Track scroll position
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 50;
      setIsAtBottom(atBottom);
      
      // Hide new message indicator if user scrolls to bottom
      if (atBottom && newMessagesAvailable) {
        setNewMessagesAvailable(false);
      }
    }
  };

  // Scroll to bottom when new messages arrive and user is at bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  // Initialize scroll position and add scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      scrollToBottom('auto'); // Initial scroll to bottom
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle new messages
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
      setNewMessagesAvailable(false);
    } else if (messages.length > 0) {
      // Only show new message indicator if not at bottom and not initial render
      setNewMessagesAvailable(true);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input, id: messageIdRef.current++ };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setIsTyping(true);
    const botReply = await getBotReply(input);
    setIsTyping(false);

    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: botReply, id: messageIdRef.current++ }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToNewMessages = () => {
    scrollToBottom();
    setNewMessagesAvailable(false);
  };

  const getBotReply = (message: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const responses = [
          `I received your message: "${message}". I can now handle much longer responses without any problems. The chat interface has been widened to accommodate lengthy messages and maintain good readability.`,
          `Thanks for your detailed message about "${message}". This wider chat window makes it easier to read comprehensive responses and maintain the conversation flow.`,
          `Interesting point about "${message}". With this improved width, I can provide more thorough answers without worrying about text wrapping issues.`,
          `I'm processing your query about "${message}". The wider design allows for better presentation of information and more natural conversation flow.`
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1000 + Math.random() * 1000);
    });
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
              <p className="text-xs opacity-80">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 p-6 overflow-y-auto bg-gray-50 relative"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-center max-w-md">Ask me anything and I'll do my best to help! This wider chat interface makes it easier to have more natural conversations.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-2xl rounded-lg px-4 py-2 ${msg.sender === 'user' 
                    ? 'bg-red-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                  style={{ wordBreak: 'break-word' }}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New message indicator */}
        {newMessagesAvailable && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={scrollToNewMessages}
              className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-colors flex items-center"
            >
              New messages
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`p-3 rounded-full ${input.trim() 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'} transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;