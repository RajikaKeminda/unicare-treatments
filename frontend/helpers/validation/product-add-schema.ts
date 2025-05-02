// product.schema.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Product name is required" })
    .trim(),
  description: z
    .string()
    .min(1, { message: "Description is required" }),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a non-negative number",
    }),
  category: z
    .string()
    .min(1, { message: "Category is required" }),
  stock: z
    .string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: "Stock must be a non-negative number",
    }),
  ratings: z
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating must be at most 5" }),
});