"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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

const COLUMN_LABELS: Record<string, string> = {
  student_number: "Student ID",
  name: "Name",
  session: "Session",
  course: "Course",
  level: "Level",
  time: "Time",
  fees_type: "Fees type",
  amount: "Amount",
  payment_date: "Payment date",
};

function columnPickerLabel(columnId: string): string {
  return COLUMN_LABELS[columnId] ?? columnId.replace(/_/g, " ");
}

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
  const columns = useMemo(() => Columns({ isLoading }), [isLoading]);

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
          setData([]);
          return;
        }
        setData(result.data.getStudents);
      } catch (error) {
        console.warn("[Dashboard] load students failed (unexpected)", {
          error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
        });
        setLoadError(toUserFriendlyErrorMessage(error));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, []);

  const handleExport = () => {
    if (!tableRef.current || isLoading || loadError || data.length === 0) return;
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

  const studentCount = !isLoading && !loadError ? data.length : null;
  const hasRows = !isLoading && !loadError && data.length > 0;
  const canExport = hasRows && !loadError;
  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const isSearchActive = Boolean(globalFilter.trim());
  const emptyMessage = loadError
    ? "Student data could not be loaded. Refresh the page or try again later."
    : isSearchActive
      ? "No students match your search. Try different keywords or clear the search box."
      : "No students registered yet. New registrations will appear here.";

  return (
    <main className="mx-auto flex h-[calc(100dvh-5rem)] max-h-[calc(100dvh-5rem)] w-full max-w-[min(100%,100rem)] flex-col px-3 py-4 text-slate-800 sm:px-5 sm:py-5 lg:px-8">
      <div className="surface-elevated flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl p-4 sm:p-6 md:p-8">
        {loadError ? (
          <div className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {loadError}
          </div>
        ) : null}

        <div className={`flex min-h-0 flex-1 flex-col ${loadError ? "mt-4" : ""} pt-0`}>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Input
              placeholder="Search by ID, name, session, course, level, fees, amount, date…"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              disabled={Boolean(loadError)}
              className="w-full bg-white sm:max-w-md sm:flex-1"
              aria-label="Search students"
            />
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {studentCount !== null ? (
                <p className="w-full text-sm text-slate-600 sm:mr-2 sm:w-auto sm:tabular-nums">
                  {isSearchActive ? (
                    <>
                      {filteredRowCount} of {studentCount} matching search
                    </>
                  ) : (
                    <>
                      {studentCount} {studentCount === 1 ? "student" : "students"}
                    </>
                  )}
                </p>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" disabled={Boolean(loadError)} className="shrink-0">
                    Columns
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {columnPickerLabel(column.id)}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="button" variant="outline" disabled={!canExport} onClick={handleExport} className="shrink-0">
                Export to Excel
              </Button>
            </div>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-inner">
            <DataTable table={table} innerRef={tableRef} emptyMessage={emptyMessage} />
          </div>
        </div>
      </div>
    </main>
  );
}
