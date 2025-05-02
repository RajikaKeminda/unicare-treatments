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
import { toast } from "sonner";
import { apiService } from "@/libs/api";
import { IAppointment } from "@/types/appointment";
import { TApiResponse } from "@/types/common";

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
        `/appointments/delete/${rowData.referenceNumber}`
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
      <AlertDialogContent className="max-w-[300px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to delete this?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex flex-col gap-2">
              <span>
                <span className="font-semibold">Ref: </span>{" "}
                <span>{rowData.referenceNumber}</span>
              </span>
              <span>
                <span className="font-semibold">Patient: </span>{" "}
                <span>
                  {rowData.firstName} {rowData.lastName}
                </span>
              </span>
              <span>
                <span className="font-semibold">Date: </span>{" "}
                <span>{rowData.channelingDate}</span>
              </span>
              <span>
                <span className="font-semibold">Session: </span>{" "}
                <span>{rowData.sessionNumber}</span>
              </span>
              <span>
                <span className="font-semibold">Time: </span>{" "}
                <span>
                  {rowData.startingTime} - {rowData.endingTime}
                </span>
              </span>
            </span>
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
