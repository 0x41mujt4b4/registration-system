"use client";

import { useEffect, useRef, useState } from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Columns from "@/app/dashboard/columns";
import DataTable from "@/app/dashboard/data-table";
import { fetchGraphQL } from "@/lib/graphql-client";
import { IStudent } from "@/types";

export default function DashboardPageClient() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IStudent[]>(Array(10).fill({ name: "" }));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const columns = Columns({ isLoading });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGraphQL<{ getStudents: IStudent[] }>(`
          query {
            getStudents {
              id
              student_number
              name
              session
              course
              level
              time
              fees_type
              amount
              payment_date
            }
          }
        `);
        setData(result.getStudents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, []);

  const handleExport = () => {
    if (!tableRef.current) return;
    const workbook = XLSX.utils.table_to_book(tableRef.current);
    XLSX.writeFile(workbook, "students_report.xlsx");
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
    <div className="flex h-full w-full flex-col border-t border-slate-300 bg-slate-200 px-4">
      <div className="flex items-center py-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("level")?.setFilterValue(event.target.value)}
          className="max-w-sm bg-white"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="ml-2 active:bg-slate-400" onClick={handleExport}>
          Export
        </Button>
      </div>
      <div className="flex h-[37rem] bg-white">
        <DataTable table={table} columns={columns} innerRef={tableRef} />
      </div>
    </div>
  );
}
