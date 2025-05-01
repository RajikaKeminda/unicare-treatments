import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const isValidDate = (val: string) => !isNaN(Date.parse(val));

export const channelAppointmentSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string(),
    gender: z.enum(["male", "female", "other"]),
    maritalState: z.enum(["single", "married", "divorced", "widowed"]),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email format"),
    address: z.string().min(5, "Address must be at least 5 characters"),
  })
  .refine((data) => isValidDate(data.dateOfBirth), {
    message: "Invalid date format",
    path: ["dateOfBirth"],
  });

export type TChannelSchema = z.infer<typeof channelAppointmentSchema>;

export type TChannel = UseFormReturn<TChannelSchema>;

export type TChannelKey = keyof TChannelSchema;
