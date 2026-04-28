"use client";

import { useEffect, useRef, useState } from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnFiltersState,
  FilterFn,
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
import { fetchGraphQL, toUserFriendlyErrorMessage } from "@/lib/graphql-client";
import { IStudent } from "@/types";

export default function DashboardPageClient() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IStudent[]>(Array(10).fill({ name: "" }));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const columns = Columns({ isLoading });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadError(null);
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
        if (!result.success) {
          setLoadError(toUserFriendlyErrorMessage(new Error(result.error)));
          return;
        }
        setData(result.data.getStudents);
      } catch (error) {
        console.warn("[Dashboard] load students failed (unexpected)", {
          error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
        });
        setLoadError(toUserFriendlyErrorMessage(error));
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

  const globalSearchFilter: FilterFn<IStudent> = (row, _columnId, filterValue) => {
    const query = String(filterValue ?? "").trim().toLowerCase();
    if (!query) return true;

    const student = row.original;
    const searchableValues = [
      student.student_number,
      student.name,
      student.session,
      student.course,
      student.level,
      student.time,
      student.fees_type,
      student.amount,
      student.payment_date,
    ];

    return searchableValues.some((value) => String(value ?? "").toLowerCase().includes(query));
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalSearchFilter,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex h-full w-full flex-col border-t border-slate-300 bg-slate-200 px-4">
      {loadError ? (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}
      <div className="flex items-center py-2">
        <Input
          placeholder="Search ID, name, session, course, level..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
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
