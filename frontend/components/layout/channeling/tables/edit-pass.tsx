"use client";
import { Button } from "@/shadcn/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import { Calendar } from "lucide-react";
import { IAppointment } from "@/types/index";
import FormFieldWrapper from "./form-field";
import OnlyDateElement from "../forms/form-elements/only-date";
import { dateSchema, onlyDateSchema } from "@/schemas/channel-schema";
import { apiService } from "@/libs/api";
import { TApiResponse } from "@/types/users";
import { toast } from "sonner";

export function EditPass({
  rowData,
  refreshFn,
}: {
  rowData: IAppointment;
  refreshFn: () => void;
}) {
  const form = useForm<dateSchema>({
    resolver: zodResolver(onlyDateSchema),
    defaultValues: {
      _id: (rowData._id || "").toString(),
      referenceNumber: rowData.referenceNumber,
      appointmentDate: new Date(rowData.appointmentDate || ""),
    },
  });

  const onSubmit = async (values: dateSchema) => {
    const validatedData = onlyDateSchema.safeParse(values);
    if (validatedData.success) {
      try {
        const res = await apiService.post<TApiResponse>(
          `/appointments/reschedule/${rowData._id}`,
          {
            appointmentDate: values.appointmentDate,
          }
        );
        if (!res.success) {
          toast.error("Error Editing appointment. Please try again later.");
        } else {
          toast.success("Appointment Re-Scheduled successfully.");
        }
      } catch {
        toast.error("Error Editing appointment. Please try again later.");
      } finally {
        refreshFn();
      }
    }
  };

  const isValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;
  const isDisabled = !isValid || !isDirty;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Re-schedule you appointment
          </DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormFieldWrapper form={form} name="_id" label="_id" isHidden />
        <FormFieldWrapper
          form={form}
          name="referenceNumber"
          label="referenceNumber"
          isHidden
        />
        <OnlyDateElement
          form={form}
          label="Available Dates"
          icon={<Calendar className="h-5 w-5 text-gray-600" />}
        />

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" aria-disabled={false} disabled={isDisabled}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
