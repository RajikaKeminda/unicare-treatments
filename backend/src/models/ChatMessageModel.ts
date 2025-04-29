import { Document, model, Schema } from 'mongoose';

// Interface
export interface IChatMessage {
  sender: 'user' | 'bot';
  text: string;
  userId: string;
  timestamp: Date;
}

// Schema
const ChatMessageSchema = new Schema<IChatMessage>({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Model
export const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema);