import mongoose, { Schema, Document } from 'mongoose';

export interface IAdviceRequest extends Document {
  name: string;
  email: string;
  concern: string;
  message: string;
}

const AdviceRequestSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  concern: { type: String, required: true },
  message: { type: String, required: true },
});

export default mongoose.model<IAdviceRequest>('AdviceRequest', AdviceRequestSchema);