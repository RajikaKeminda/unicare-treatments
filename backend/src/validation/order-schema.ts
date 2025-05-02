import { z } from "zod";
import mongoose from "mongoose";

// Payment method enum (matches Mongoose enum)
const PaymentMethodEnum = z.enum([
  "credit_card",
  "paypal",
  "cash_on_delivery",
]);

// Order status enum (matches Mongoose enum)
const OrderStatusEnum = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

// Base order validation schema
export const OrderValidationSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address cannot exceed 200 characters"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be at least 1"),
  paymentMethod: PaymentMethodEnum,
  totalPrice: z
    .number()
    .positive("Total price must be a positive number")
    .min(0.01, "Total price must be at least $0.01"),
  status: OrderStatusEnum.optional().default("pending"),
});

// For creating a new order (all fields required except status)
export const CreateOrderSchema = OrderValidationSchema.omit({ status: true });

// For updating an order (all fields optional)
export const UpdateOrderSchema = OrderValidationSchema.partial();

// For querying/filtering orders
export const OrderQuerySchema = z.object({
  status: OrderStatusEnum.optional(),
  minTotalPrice: z.number().optional(),
  maxTotalPrice: z.number().optional(),
});