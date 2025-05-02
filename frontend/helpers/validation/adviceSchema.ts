// advice-request.schema.ts
import { z } from "zod";

export const adviceRequestSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  concern: z.string().min(1, { message: "Concern is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  createdAt: z.string().or(z.date()) // Accepts either string or Date
});

export type AdviceRequest = z.infer<typeof adviceRequestSchema>;
