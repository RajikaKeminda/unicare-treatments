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
import { useState } from "react";
import { DataTablePagination } from "@/channeling/elements/table-elements/pagination";

import { Input } from "@/shadcn/ui/input";
import { cn } from "@/libs/utils";

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

  const getFilterValue = () => {
    const column = table.getColumn("_id");
    return (column?.getFilterValue() as string) ?? "";
  };

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap items-center pb-4 gap-2 w-full justify-between">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
          {children}
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
          <Input
            placeholder="Search by Ref"
            value={getFilterValue()}
            onChange={(event) => {
              const value = event.target.value;
              table.getColumn("_id")?.setFilterValue(value);
            }}
            className={cn("max-w-sm border-2 !ring-0 min-w-[200px]")}
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
