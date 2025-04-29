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

import Link from "next/link";
import { ArrowLeft, PlusIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { useState } from "react";
import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "./view-options";

import { Input } from "@/shadcn/ui/input";
import { cn } from "@/libs/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    details: false,
    modified: false,
    id: false,
  });
  const [rowSelection, setRowSelection] = useState({});

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

  return (
    <>
      <div className="flex items-center pb-4 gap-2 w-full justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/channeling"
            className="flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8  rounded-md px-3"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
            <div className="flex items-center gap-[4px]">
              <span className="inline md:hidden">Back</span>
              <span className="hidden md:inline">Appointment Center</span>
            </div>
          </Link>

          <Link
            href="/channeling/channel-appointment"
            className="flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3"
          >
            <PlusIcon className="h-4 w-4 text-gray-600" />
            Add
          </Link>
          <DataTableViewOptions table={table} />
        </div>
        <Input
          placeholder="Filter REF..."
          value={
            (table.getColumn("referenceNumber")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("referenceNumber")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
