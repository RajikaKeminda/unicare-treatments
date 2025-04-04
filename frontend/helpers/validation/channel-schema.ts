import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const isValidDate = (val: string) => !isNaN(Date.parse(val));

export const channelAppointmentSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string(),
    gender: z.enum(["male", "female", "other"]),
    maritalState: z.enum(["married", "single", "widowed"]),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    alternativePhoneNumber: z.string().optional(),
    email: z.string().email("Invalid email format"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    appointmentDate: z.preprocess(
      (val) =>
        typeof val === "string" && isValidDate(val) ? new Date(val) : val,
      z.date()
    ),
    paymentStatus: z.enum(["pay now", "pay later"]),
  })
  .refine((data) => isValidDate(data.dateOfBirth), {
    message: "Invalid date format",
    path: ["dateOfBirth"],
  });

export type channelSchema = z.infer<typeof channelAppointmentSchema>;

export type channel = UseFormReturn<channelSchema>;

export type channelKey = keyof channelSchema;

export const onlyDateSchema = z.object({
  _id: z.string(),
  appointmentDate: z.preprocess(
    (val) =>
      typeof val === "string" && isValidDate(val) ? new Date(val) : val,
    z.date()
  ),
  referenceNumber: z.string(),
});

export type dateSchema = z.infer<typeof onlyDateSchema>;

export type dateSchemaExtended = UseFormReturn<dateSchema>;
