"use client";

import { useState, useEffect, useRef } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Columns from "./columns";
import DataTable from "./data-table";
import { fetchGraphQL } from "@/lib/graphql-client";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IStudent } from "@/types";

export default function DataTableDemo() {
  const tbl = useRef<HTMLTableElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IStudent[]>(Array(10).fill({}));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const columns = Columns({ isLoading });
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleExport = () => {
    if (tbl.current) {
      const wb = XLSX.utils.table_to_book(tbl.current);
      XLSX.writeFile(wb, "students_report.xlsx");
    }
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
    <div className="flex flex-col w-full h-full px-4 bg-slate-200 border-t border-slate-300">
      <div className="flex items-center py-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("level")?.setFilterValue(event.target.value)
          }
          className="bg-white max-w-sm"
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
      <div className="flex bg-white h-[37rem]">
        <DataTable table={table} columns={columns} innerRef={tbl} />
      </div>
    </div>
  );
}