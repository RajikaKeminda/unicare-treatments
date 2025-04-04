"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog";
import { Button } from "@/shadcn/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { IAppointment } from "@/types/index";
import { toast } from "sonner";
import { apiService } from "@/libs/api";
import { TApiResponse } from "@/types/users";

const DeleteDialog = ({
  rowData,
  refreshFn,
}: {
  rowData: IAppointment;
  refreshFn: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const submitHandler = async () => {
    try {
      const res = await apiService.delete<TApiResponse>(
        `/appointments/refNo/${rowData.referenceNumber}`
      );
      if (!res.success) {
        toast.error("Error deleting appointment. Please try again later.");
      } else {
        toast.success("Appointment deleted successfully.");
        setOpen(false);
      }
    } catch {
      toast.error("Error deleting appointment. Please try again later.");
    } finally {
      refreshFn();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-800">
          <Trash className="w-4 h-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your&nbsp;<b>({rowData.referenceNumber})</b>&nbsp;appointment will
            be deleted. This action cannot be undone. Please contact&nbsp;
            <b>07711111111</b>&nbsp;if you need to reschedule your appointment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            type="button"
            aria-disabled={false}
            className="w-auto bg-red-600"
            onClick={submitHandler}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
