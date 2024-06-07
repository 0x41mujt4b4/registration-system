"use client";

import {useState, useEffect, useRef} from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Columns from './columns';
import DataTable from "./data-table";
import DataTablePagination from "./DataTablePagination";
import { get } from "http";
import getStudents from "@/server/getStudents";
import { set } from "zod";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DataTableDemo() {
  const tbl = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(Array(8).fill({}))
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const columns = Columns({isLoading})
  const { data: sessionData, status } = useSession()
  const router = useRouter();

  useEffect(() => {
    console.log(status);
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStudents();
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    console.log("Exporting data...");

    /* Create worksheet from HTML DOM TABLE */
    const wb = XLSX.utils.table_to_book(tbl.current);
    /* Export to file (start a download) */
    XLSX.writeFile(wb, "students_report.xlsx");
    // // generate a worksheet
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // // create a workbook
    // const workbook = XLSX.utils.book_new();
    // // add worksheet to workbook
    // XLSX.utils.book_append_sheet(workbook, worksheet, "students_report");
    // // write to XLSX
    // XLSX.writeFileXLSX(workbook, "students_report.xlsx");
  }
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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
  })
  

  return (
    <div className="flex flex-col w-full h-full px-4 bg-slate-200 border-t border-slate-300">
      <div className="flex items-center py-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("level").getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("level").setFilterValue(event.target.value)
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
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="ml-2 active:bg-slate-400" onClick={() => handleExport()}>
          Export
        </Button>
      </div>
      <div className="flex bg-white h-[28rem]">
      <DataTable table={table} columns={columns} innerRef={tbl}/>
      </div>
      {/* <DataTablePagination table={table}/> */}
    </div>
  )
}