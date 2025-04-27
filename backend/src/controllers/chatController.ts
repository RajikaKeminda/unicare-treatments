import { Request, Response } from 'express';
import { ChatMessage, IChatMessage } from '../models/ChatMessageModel.ts';

// Helper function with explicit return type
const getBotReply = async (userMessage: string): Promise<string> => {
  const responses = [
    `I received: "${userMessage}". How can I assist further?`,
    `Regarding "${userMessage}", here's what I know...`,
    `Interesting! Tell me more about "${userMessage}".`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Typed request body
interface ChatRequest {
  text: string;
  userId: string;
}

// Save message with proper typing
export const saveMessage = async (
  sender: 'user' | 'bot',
  text: string,
  userId: string
): Promise<IChatMessage> => {
  return await ChatMessage.create({ sender, text, userId });
};

// Controller with error typing
export const processMessage = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response
): Promise<void> => {
  const { text, userId } = req.body;

  if (!text || !userId) {
    res.status(400).json({ error: 'Text and userId are required' });
    return;
  }

  try {
    // 1. Save user message
    await saveMessage('user', text, userId);
    
    // 2. Get bot reply
    const botReply = await getBotReply(text);
    
    // 3. Save bot reply
    await saveMessage('bot', botReply, userId);
    
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({ 
      error: 'Chat processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};