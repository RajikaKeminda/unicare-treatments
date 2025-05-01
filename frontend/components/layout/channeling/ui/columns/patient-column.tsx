"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/channeling/elements/table-elements/sort-menu";

import CopyToClipboard from "@/channeling/widgets/copy-to-clipboard";
import { IAppointment } from "@/types/appointment";
import { cn } from "@/libs/utils";
import Image from "next/image";
import {
  format,
  formatDistanceToNow,
  isBefore,
  isToday,
  isTomorrow,
  startOfToday,
} from "date-fns";
import { BsCash } from "react-icons/bs";
import Link from "next/link";

import { FaClock } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { SiCashapp } from "react-icons/si";

const isBeforeToday = (date: Date): boolean => {
  return isBefore(date, startOfToday());
};

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

const appointmentStatusObj = {
  waiting: {
    iconCss: "w-4 h-4",
    text: "Waiting",
    color: "bg-yellow-500/50 text-yellow-900 border-yellow-600",
    icon: FaClock,
    key: "waiting",
  },
  attending: {
    iconCss: "w-4 h-4",
    text: "Attending",
    color: "bg-blue-500/50 text-blue-900 border-blue-600",
    icon: FaCircleCheck,
    key: "attending",
  },
  completed: {
    iconCss: "w-4 h-4",
    text: "Completed",
    color: "bg-green-500/50 text-green-900 border-green-600",
    icon: FaCircleCheck,
    key: "completed",
  },
  cancelled: {
    iconCss: "w-5 h-5",
    text: "Cancelled",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
    key: "cancelled",
  },
  "no-show": {
    iconCss: "w-5 h-5",
    text: "No Show",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
    key: "no-show",
  },
};

type TAppointmentStatus = keyof typeof appointmentStatusObj;

export const getColumns = (userId: string): ColumnDef<IAppointment>[] => {
  const columns: ColumnDef<IAppointment>[] = [
    {
      accessorKey: "referenceNumber",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="REF" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <CopyToClipboard
              value={rowData.referenceNumber || ""}
              text=""
            ></CopyToClipboard>
            <div className="border border-dashed py-2 px-2 border-black">
              {rowData.referenceNumber}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "channelingDate",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="DATE" />
      ),
      cell: ({ row }) => {
        const dob = row.getValue("channelingDate");
        if (!dob) {
          return <div className="text-gray-400">N/A</div>;
        }
        const formattedDate = format(new Date(`${dob}`), "yyyy / MM / dd");
        return <div className="min-w-max">{`${formattedDate}`}</div>;
      },
    },

    {
      accessorKey: "TimeSlot",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="TIME" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div>
            <div className="flex items-center gap-2 font-semibold text-blue-950 min-w-max">
              {`Session : `}
              <div className="rounded-full w-4 h-4 border border-black flex items-center justify-center">
                {rowData.sessionNumber}
              </div>
            </div>
            <div className="min-w-max">{`( ${rowData.startingTime} - ${rowData.endingTime} )`}</div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        // First compare by session number
        const sessionA = Number(rowA.original.sessionNumber) || 0;
        const sessionB = Number(rowB.original.sessionNumber) || 0;

        if (sessionA !== sessionB) {
          return sessionA - sessionB; // Simple numeric comparison for sessions
        }

        // If sessions are equal, compare by starting time
        const startTimeA = rowA.original.startingTime || "";
        const startTimeB = rowB.original.startingTime || "";
        // Parse time strings to compare them properly
        const parseTimeString = (timeStr: string) => {
          // Handle formats like "12:30 PM", "9:45 AM"
          const [timePart, period] = timeStr.trim().split(" ");
          const [hours, minutes] = timePart.split(":").map(Number);

          let hour24 = hours;
          if (period) {
            // 12-hour format with AM/PM
            if (period.toUpperCase() === "PM" && hours < 12) {
              hour24 = hours + 12;
            } else if (period.toUpperCase() === "AM" && hours === 12) {
              hour24 = 0;
            }
          }

          return hour24 * 60 + minutes; // Convert to minutes for easy comparison
        };

        const timeValueA = parseTimeString(startTimeA);
        const timeValueB = parseTimeString(startTimeB);
        return timeValueA - timeValueB;
      },
    },
    {
      accessorKey: "paymentStatus",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="PAYMENT" />
      ),
      cell: ({ row }) => {
        const obj =
          paymentStatusObj[row.getValue("paymentStatus") as TPaymentStatus];
        const Icon = obj.icon;
        if (obj.key === "pending") {
          return (
            <Link
              href={`/appointment-payment?appointmentId=${row.getValue(
                "referenceNumber"
              )}&userId=${userId}`}
            >
              <div
                className={cn(
                  "cursor-pointer px-2 py-1 border-2 rounded-md min-w-36 inline-flex items-center justify-center gap-2",
                  obj.color
                )}
              >
                <Icon className={cn(obj.iconCss)} />
                {`${obj.secondaryText}`}
              </div>
            </Link>
          );
        }
        return (
          <div
            className={cn(
              "cursor-pointer px-2 py-1 border-2 rounded-md min-w-36 inline-flex items-center justify-center gap-2",
              obj.color
            )}
          >
            <Icon className={cn(obj.iconCss)} />
            {`${obj.secondaryText}`}
          </div>
        );
      },
    },
    {
      accessorKey: "doctorName",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="DOCTOR" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-none rounded-full w-8 h-8 border border-black flex items-center justify-center relative overflow-hidden">
              <Image src="/assets/images/doctor.jpeg" alt="Doctor" fill />
            </div>
            {`Dr.${rowData.doctorName}`}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentAmount",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="PAYMENT" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="border border-dashed py-2 px-2 border-black flex items-center gap-2">
            <BsCash className="w-6 h-6 text-gray-500" />
            {`Rs. ${rowData.paymentAmount ? rowData.paymentAmount : 0}`}
          </div>
        );
      },
    },
    {
      accessorKey: "appointmentStatus",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="APPOINTMENT" />
      ),
      cell: ({ row }) => {
        const obj =
          appointmentStatusObj[
            row.getValue("appointmentStatus") as TAppointmentStatus
          ];
        const Icon = obj.icon;
        let relativeDate = "";
        const channelingDate = new Date(
          row.getValue("channelingDate") as string
        );
        if (obj.key === "waiting") {
          if (isToday(channelingDate)) {
            relativeDate = "It's on Today";
          } else if (isTomorrow(channelingDate)) {
            relativeDate = "It's on Tomorrow";
          } else if (isBeforeToday(channelingDate)) {
            relativeDate = `No Show`;
          } else {
            relativeDate = `It's ${formatDistanceToNow(channelingDate, {
              addSuffix: true,
            })}`;
          }
        }
        return (
          <div
            className={cn(
              "px-2 py-1 border-2 rounded-md min-w-max inline-flex items-center justify-center  gap-2 text-sm",
              relativeDate === `No Show`
                ? "bg-red-500/30 text-red-900 border-red-600"
                : `${obj.color}`
            )}
          >
            <Icon className={cn(obj.iconCss)} />
            {`${obj.text === "Waiting" ? relativeDate : obj.text}`}
          </div>
        );
      },
    },
  ];

  return columns;
};
