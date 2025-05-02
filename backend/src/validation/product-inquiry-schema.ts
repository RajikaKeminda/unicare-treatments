import { z } from "zod";

export const AdviceRequestValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters")
    .trim(),

  concern: z
    .string()
    .min(5, "Concern must be at least 5 characters")
    .max(200, "Concern cannot exceed 200 characters")
    .trim(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters")
    .trim(),
});

// For creating a new advice request (all fields required)
export const CreateAdviceRequestSchema = AdviceRequestValidationSchema;

// For partial updates (all fields optional)
export const UpdateAdviceRequestSchema = AdviceRequestValidationSchema.partial();