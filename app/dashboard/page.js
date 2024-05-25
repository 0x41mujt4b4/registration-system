"use client";

import {useState} from "react";
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
import {columns} from './columns';
import DataTable from "./data-table";
import DataTablePagination from "./DataTablePagination";

const data = [
  {
    id: "001",
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
  {
    id: "001",
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
  {
    id: "001",
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
  {
    id: "001",
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
  {
    id: "001",
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
  {
    id: 343,
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
  {
    id: "001",
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
  {
    id: "001",
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
  {
    id: "001",
    name: "محمد أحمد علي عمر",
    session: "Regular",
    course: "Communication",
    level: "Level-6",
    time: "01/05/2024",
    fees_type: "Course Fees",
    amount: 1500,
  },
]



export default function DataTableDemo() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    <div className="flex flex-col w-full h-full px-4">
      <div className="flex items-center py-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("name").getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("name").setFilterValue(event.target.value)
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
      </div>
      <div className="flex bg-white h-[28rem]">
      <DataTable table={table} columns={columns}/>
      </div>
      {/* <DataTablePagination table={table}/> */}
    </div>
  )
}