"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog";
import { Button } from "@/shadcn/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiService } from "@/libs/api";
import { IAppointment } from "@/types/appointment";
import { TApiResponse } from "@/types/common";
import { cn } from "@/libs/utils";
import { BsCashCoin } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { SiCashapp } from "react-icons/si";

const paymentStatusObj = {
  pending: {
    text: "Pending",
    secondaryText: "Pay Now",
    color: "bg-yellow-500/50 text-yellow-900 border-yellow-600",
    icon: SiCashapp,
    key: "pending",
    iconCss: "w-3 h-3",
  },
  completed: {
    text: "Completed",
    secondaryText: "Payment Done",
    color: "bg-green-500/50 text-green-900 border-green-600",
    icon: FaCircleCheck,
    key: "completed",
    iconCss: "w-4 h-4",
  },
  cancelled: {
    text: "Cancelled",
    secondaryText: "Cancelled",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
    key: "cancelled",
    iconCss: "w-4 h-4",
  },
};

type TPaymentStatus = keyof typeof paymentStatusObj;

const PaymentDialog = ({
  rowData,
  refreshFn,
}: {
  rowData: IAppointment;
  refreshFn: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TPaymentStatus>("pending");

  const submitHandler = async () => {
    try {
      const res = await apiService.put<TApiResponse>(
        `/appointments/update-appointment-status/${rowData.referenceNumber}`,
        {
          paymentStatus: selected,
          paymentId: selected === "completed" ? "Cash" : "",
        }
      );
      if (!res.success) {
        toast.error("Error changing appointment. Please try again later.");
      } else {
        toast.success("Appointment deleted successfully.");
        setOpen(false);
      }
    } catch {
      toast.error("Error changing appointment. Please try again later.");
    } finally {
      refreshFn();
    }
  };

  useEffect(() => {
    setSelected(rowData.paymentStatus as TPaymentStatus);
  }, [rowData.paymentStatus, open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-800">
          <BsCashCoin className="w-4 h-4" />
          Payment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[300px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Change Status
          </AlertDialogTitle>

          <div className="flex flex-col gap-2 items-center border-2 border-dashed border-black p-2">
            {Object.values(paymentStatusObj).map((status) => (
              <div
                key={status.text}
                className={cn(
                  "cursor-pointer max-w-max px-2 py-1 border-2 rounded-md inline-flex items-center justify-center  gap-2 text-sm",
                  `${status.color}`,
                  selected === status.key ? "opacity-100" : "opacity-40"
                )}
                onClick={() => {
                  setSelected(status.key as TPaymentStatus);
                }}
              >
                <status.icon className={cn(status.iconCss)} />
                {status.text}
              </div>
            ))}
          </div>
        </AlertDialogHeader>
        <div className="flex items-center justify-center gap-5">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            aria-disabled={false}
            className="w-auto bg-blue-600"
            onClick={submitHandler}
          >
            Save
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentDialog;
