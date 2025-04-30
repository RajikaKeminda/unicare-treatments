import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email address'),
  phone: z.string()
    .min(7, 'Phone number must be at least 7 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  products: z.array(
    z.string()
      .min(1, 'Product name cannot be empty')
      .max(100, 'Product name must be less than 100 characters')
  ),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
});

export type SupplierFormData = z.infer<typeof supplierSchema>; 