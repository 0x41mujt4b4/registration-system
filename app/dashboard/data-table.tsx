"use client";

import type { RefObject } from "react";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData> = {
  table: TanstackTable<TData>;
  innerRef?: RefObject<HTMLTableElement | null>;
  emptyMessage?: string;
};

export default function DataTable<TData>({
  table,
  innerRef,
  emptyMessage = "Nothing to show.",
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const colSpan = Math.max(1, table.getVisibleLeafColumns().length);

  return (
    <Table
      ref={innerRef}
      className="w-full min-w-[80rem] table-auto"
      containerClassName="overflow-visible"
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-zinc-200 hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={cn(
                  "sticky top-0 z-20 h-12 whitespace-nowrap border-b-2 border-zinc-200 bg-slate-100 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-800 shadow-sm",
                )}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length ? (
          rows.map((row) => (
            <TableRow key={row.id} className="border-b border-zinc-100 transition-colors hover:bg-slate-50/90">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-3 py-2 align-middle text-slate-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={colSpan} className="h-32 text-center text-sm text-slate-500">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
