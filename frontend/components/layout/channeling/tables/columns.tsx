"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./sort-menu";

import { IAppointment } from "@/types/index";

export const columns: ColumnDef<IAppointment>[] = [
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
