"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./sort-menu";

import { IAppointment } from "@/types/index";
import { Dialog, DialogContent, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Pencil } from "lucide-react";
import DeleteDialog from "./delete-dialog";
import CopyToClipboard from "./copy-to-clipboard";
import { EditPass } from "./edit-pass";

export const getColumns = (
  refreshPage: () => void,
  getPaymentDone: (data: IAppointment) => void
): ColumnDef<IAppointment>[] => {
  const columns: ColumnDef<IAppointment>[] = [
    {
      id: "actions",
      accessorKey: "actions",
      header: () => <div className="text-white">ACTIONS</div>,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex align-items justify-center gap-2">
            <CopyToClipboard
              value={rowData.referenceNumber || ""}
            ></CopyToClipboard>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-800">
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <EditPass rowData={rowData} refreshFn={refreshPage} />
              </DialogContent>
            </Dialog>
            <DeleteDialog rowData={rowData} refreshFn={refreshPage} />
            <Button onClick={() => getPaymentDone(rowData)}>Pay Now</Button>
          </div>
        );
      },
    },
    {
      accessorKey: "referenceNumber",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="REF" />
      ),
    },

    {
      accessorKey: "appointmentDate",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="APPOINTMENT" />
      ),
      cell: ({ row }) => {
        const dob = row.getValue("appointmentDate");
        const date = new Date(`${dob}`);
        return (
          <div>{`${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`}</div>
        );
      },
    },

    {
      accessorKey: "fullName",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="NAME" />
      ),
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="DOB" />
      ),
      cell: ({ row }) => {
        const dob = row.getValue("dateOfBirth");
        const date = new Date(`${dob}`);
        return (
          <div>{`${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`}</div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="EMAIL" />
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="GENDER" />
      ),
      cell: ({ row }) => {
        const gender = row.getValue("gender");
        let newGenderValue = "";
        if (gender === "other") {
          newGenderValue = "Not Specified";
        } else {
          newGenderValue = `${gender}`;
        }
        return <div>{`${newGenderValue}`}</div>;
      },
    },

    {
      accessorKey: "maritalState",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="MARITAL" />
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="PAYMENT" />
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="ADDRESS" />
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="PHONE" />
      ),
    },
    {
      accessorKey: "alternativePhoneNumber",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="OTHER PHONE" />
      ),
    },
  ];

  return columns;
};
