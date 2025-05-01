"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/channeling/elements/table-elements/sort-menu";

import { IUser } from "@/types/users";
import RoleDialog from "@/channeling/ui/dialogs/role-dialog";
import { cn } from "@/libs/utils";
import { FaCheckCircle, FaUser } from "react-icons/fa";
import { format } from "date-fns";
import { IoMdCloseCircle } from "react-icons/io";
import CopyToClipboard from "@/channeling/widgets/copy-to-clipboard";

const roleStatus = {
  doctor: {
    text: "Doctor",
    color: "bg-yellow-500/50 text-yellow-900 border-yellow-600",
    icon: FaUser,
    key: "doctor",
    iconCss: "w-3 h-3",
  },
  admin: {
    text: "Admin",
    color: "bg-green-500/50 text-green-900 border-green-600",
    icon: FaUser,
    key: "admin",
    iconCss: "w-3 h-3",
  },
  supplier: {
    text: "Supplier",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: FaUser,
    key: "supplier",
    iconCss: "w-3 h-3",
  },
  user: {
    text: "User",
    color: "bg-blue-500/50 text-blue-900 border-blue-600",
    icon: FaUser,
    key: "user",
    iconCss: "w-3 h-3",
  },
};

type TPaymentStatus = keyof typeof roleStatus;

export const getColumns = (refreshPage: () => void): ColumnDef<IUser>[] => {
  const columns: ColumnDef<IUser>[] = [
    {
      id: "actions",
      accessorKey: "actions",
      header: () => <div className="text-white">ACTIONS</div>,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex align-items justify-center gap-2">
            <RoleDialog rowData={rowData} refreshFn={refreshPage} />
          </div>
        );
      },
    },
    {
      accessorKey: "_id",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <CopyToClipboard
              value={rowData._id || ""}
              text=""
            ></CopyToClipboard>
            <div className="border border-dashed py-2 px-2 border-black">
              {rowData._id}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "username",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="USERNAME" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="EMAIL" />
      ),
    },

    {
      accessorKey: "role",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="ROLE" />
      ),
      cell: ({ row }) => {
        const obj = roleStatus[row.getValue("role") as TPaymentStatus];
        const Icon = obj.icon;

        return (
          <div
            className={cn(
              "cursor-pointer px-2 py-1 border-2 rounded-md min-w-28 inline-flex items-center justify-center gap-2",
              `${obj.color}`
            )}
          >
            <Icon className={cn(obj.iconCss)} />
            {`${obj.text}`}
          </div>
        );
      },
    },
    {
      accessorKey: "firstName",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="FIRST NAME" />
      ),
      cell: ({ row }) => {
        const firstName = row.getValue("firstName");
        if (!firstName) {
          return <div className="text-gray-400">N/A</div>;
        }
        return <div className="min-w-max">{`${firstName}`}</div>;
      },
    },
    {
      accessorKey: "lastName",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="LAST NAME" />
      ),
      cell: ({ row }) => {
        const lastName = row.getValue("lastName");
        if (!lastName) {
          return <div className="text-gray-400">N/A</div>;
        }
        return <div className="min-w-max">{`${lastName}`}</div>;
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="DOB" />
      ),
      cell: ({ row }) => {
        const dob = row.getValue("dateOfBirth");
        if (!dob) {
          return <div className="text-gray-400">N/A</div>;
        }
        const formattedDate = format(new Date(`${dob}`), "yyyy / MM / dd");
        return <div className="min-w-max">{`${formattedDate}`}</div>;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="PHONE" />
      ),
      cell: ({ row }) => {
        const phoneNumber = row.getValue("phoneNumber");
        if (!phoneNumber) {
          return <div className="text-gray-400">N/A</div>;
        }
        return <div className="min-w-max">{`${phoneNumber}`}</div>;
      },
    },
    {
      accessorKey: "address",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="ADDRESS" />
      ),
      cell: ({ row }) => {
        const address = row.getValue("address");
        if (!address) {
          return <div className="text-gray-400">N/A</div>;
        }
        return <div className="min-w-max">{`${address}`}</div>;
      },
    },
    {
      accessorKey: "maritalState",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="MARITAL STATE" />
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="GENDER" />
      ),
    },
    {
      accessorKey: "isVerified",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="IS VERIFIED" />
      ),
      cell: ({ row }) => {
        const isVerified = row.getValue("isVerified");
        return (
          <div
            className={cn(
              "min-w-max border-2 rounded-full flex items-center justify-center py-1 uppercase gap-2",
              isVerified
                ? "bg-green-50 text-green-950  border-green-950"
                : "bg-red-50 text-red-950  border-red-950"
            )}
          >
            {isVerified ? <FaCheckCircle /> : <IoMdCloseCircle />}
            {`${isVerified}`}
          </div>
        );
      },
    },
  ];

  return columns;
};
