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
import { TApiResponse } from "@/types/common";
import { cn } from "@/libs/utils";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { SiCashapp } from "react-icons/si";
import { IUser } from "@/types/users";
import { FaUserAlt } from "react-icons/fa";

const roleStatus = {
  doctor: {
    text: "Doctor",
    color: "bg-yellow-500/50 text-yellow-900 border-yellow-600",
    icon: SiCashapp,
    key: "doctor",
    iconCss: "w-3 h-3",
  },
  admin: {
    text: "Admin",
    color: "bg-green-500/50 text-green-900 border-green-600",
    icon: FaCircleCheck,
    key: "admin",
    iconCss: "w-4 h-4",
  },
  supplier: {
    text: "Supplier",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
    key: "supplier",
    iconCss: "w-4 h-4",
  },
  user: {
    text: "User",
    color: "bg-blue-500/50 text-blue-900 border-blue-600",
    icon: IoIosCloseCircle,
    key: "user",
    iconCss: "w-4 h-4",
  },
};

type TPaymentStatus = keyof typeof roleStatus;

const RoleDialog = ({
  rowData,
  refreshFn,
}: {
  rowData: IUser;
  refreshFn: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TPaymentStatus>("user");

  const submitHandler = async () => {
    try {
      const res = await apiService.put<TApiResponse>(`/users/${rowData._id}`, {
        role: selected,
      });
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
    setSelected(rowData.role as TPaymentStatus);
  }, [rowData.role, open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-gray-800">
          <FaUserAlt className="w-4 h-4" />
          Change User Role
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-max">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Change Role <span className="capitalize">({selected})</span>
          </AlertDialogTitle>

          <div className="flex gap-2 items-center border-2 border-dashed border-black p-2">
            {Object.values(roleStatus).map((status) => (
              <div
                key={status.text}
                className={cn(
                  "cursor-pointer max-w-max px-2 py-1 border-2 rounded-md inline-flex items-center justify-center  gap-2 text-sm",
                  `${status.color}`,
                  selected === status.key ? "opacity-100" : "opacity-30"
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

export default RoleDialog;
