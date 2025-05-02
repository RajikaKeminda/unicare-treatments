import { z } from "zod";

// Base product validation schema
export const ProductValidationSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least $0.01"),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category cannot exceed 50 characters"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
  ratings: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating cannot exceed 5"),
});

// For creating a new product (all fields required)
export const CreateProductSchema = ProductValidationSchema;

// For updating a product (all fields optional)
export const UpdateProductSchema = ProductValidationSchema.partial();

// For querying products (e.g., filtering by category)
export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().min(0).max(5).optional(),
});

