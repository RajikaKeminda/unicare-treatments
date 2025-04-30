import { z } from 'zod';

export const inventorySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  quantity: z.number()
    .min(0, 'Quantity cannot be negative')
    .max(999999, 'Quantity is too large'),
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit must be less than 20 characters'),
  perItemPrice: z.number()
    .min(0, 'Price cannot be negative')
    .max(999999, 'Price is too large'),
  expiryDate: z.string()
    .refine((date) => {
      const today = new Date();
      const expiryDate = new Date(date);
      return expiryDate > today;
    }, 'Expiry date must be in the future')
});

export type InventoryFormData = z.infer<typeof inventorySchema>; 