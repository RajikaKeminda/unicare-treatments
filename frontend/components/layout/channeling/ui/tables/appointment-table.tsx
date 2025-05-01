"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { useEffect, useState } from "react";
import { DataTablePagination } from "@/channeling/elements/table-elements/pagination";
import { DataTableViewOptions } from "@/channeling/elements/table-elements/view-options";

import { Input } from "@/shadcn/ui/input";
import { cn } from "@/libs/utils";
import { FaFile, FaUser } from "react-icons/fa";
import { BsCash } from "react-icons/bs";
import DateElement from "@/channeling/elements/form-elements/date-element";
import { format } from "date-fns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children?: React.ReactNode;
  onlyRef?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
  onlyRef = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      desc: true,
      id: "channelingDate",
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    details: false,
    modified: false,
    id: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [selectedFilter, setSelectedFilter] = useState<
    "referenceNumber" | "paymentId" | "patientId" | "channelingDate"
  >("referenceNumber");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const resetFilters = () => {
    if (!onlyRef) {
      table.getColumn("patientId")?.setFilterValue("");
      table.getColumn("paymentId")?.setFilterValue("");
    }
    table.getColumn("referenceNumber")?.setFilterValue("");
    table.getColumn("channelingDate")?.setFilterValue("");
  };

  const getFilterValue = () => {
    const column = table.getColumn(selectedFilter);
    return (column?.getFilterValue() as string) ?? "";
  };

  const filterStyles = {
    referenceNumber: "border-black",
    patientId: "border-green-500",
    paymentId: "border-blue-500",
    channelingDate: "border-gray-300",
  };

  const filterOptions = [
    {
      id: "referenceNumber",
      icon: <FaFile className="w-4 h-4" />,
      activeClasses: "bg-black/20 border-black text-black",
    },
    {
      id: "patientId",
      icon: <FaUser className="w-4 h-4" />,
      activeClasses: "bg-green-200 border-green-500 text-green-500",
    },
    {
      id: "paymentId",
      icon: <BsCash className="w-4 h-4" />,
      activeClasses: "bg-blue-200 border-blue-500 text-blue-500",
    },
  ];
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (date) {
      resetFilters();
      table
        .getColumn("channelingDate")
        ?.setFilterValue(format(new Date(`${date}`), "yyyy-MM-dd"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap items-center pb-4 gap-2 w-full justify-between">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
          {children} <DataTableViewOptions table={table} />
          <DateElement
            onDateChange={(newDate) => {
              resetFilters();
              table.getColumn("channelingDate")?.setFilterValue(newDate);
              setDate(newDate);
            }}
            date={date}
          />
          <div
            className="underline underline-offset-2 cursor-pointer text-sm text-gray-600"
            onClick={() => {
              resetFilters();
              setDate(undefined);
            }}
          >
            Reset Filters
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
          <div className="flex items-center gap-2">
            {filterOptions.map((option) => {
              if (onlyRef) {
                return null;
              }
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedFilter(option.id as keyof typeof filterStyles);
                    table.getColumn(selectedFilter)?.setFilterValue("");
                  }}
                  className={cn(
                    "rounded-md p-2 text-gray-200 border-2",
                    selectedFilter === option.id
                      ? option.activeClasses
                      : "border-gray-300"
                  )}
                >
                  {option.icon}
                </button>
              );
            })}
          </div>
          <Input
            placeholder={
              selectedFilter === "paymentId"
                ? "Search by Payment ID"
                : selectedFilter === "patientId"
                  ? "Search by Patient ID"
                  : "Search by Ref"
            }
            value={getFilterValue()}
            onChange={(event) => {
              const value = event.target.value;
              setDate(undefined);
              resetFilters();
              table.getColumn(selectedFilter)?.setFilterValue(value);
            }}
            className={cn(
              "max-w-sm border-2 !ring-0 min-w-[200px]",
              filterStyles[selectedFilter]
            )}
          />
        </div>
      </div>
      <div className="w-full rounded-md border">
        <Table
          className={cn(
            table.getRowModel().rows?.length === 0 && "min-h-[400px]",
            "flex-auto"
          )}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-black hover:bg-black"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-white hover:bg-gray-100/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-10">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-white hover:bg-white">
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-full"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
}
