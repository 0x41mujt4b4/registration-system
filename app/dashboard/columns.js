"use client";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

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
// import { Skeleton } from "@radix-ui/themes";
import Skeleton from '@mui/material/Skeleton';

export default function Columns({isLoading}) {
  return (
  [
  {
    accessorKey: "id",
    header: ({ column }) => (
      isLoading ? <Skeleton  animation="wave" height={30} /> :
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <CaretSortIcon className="text-center size-4" />
      </Button>
    ),
    cell: ({ row }) => isLoading ? <Skeleton  animation="wave" height={30} /> : <div className="lowercase ml-6">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton  animation="wave" height={30} /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => isLoading ? <Skeleton  animation="wave" height={30} /> : <div className="font-serif font-medium text-lg">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "session",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton  animation="wave" height={30} /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Session
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );},
    cell: ({ row }) => (
      isLoading ? <Skeleton  animation="wave" height={30} /> :
      <div className="capitalize text-center ">{row.getValue("session")}</div>
    ),
  },
  {
    accessorKey: "course",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton  animation="wave" height={30} /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );},
    cell: ({ row }) => (isLoading ? <Skeleton  animation="wave" height={30} /> : 
      <div className="capitalize text-center">{row.getValue("course")}</div>
    ),
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton  animation="wave" height={30} /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );},
    cell: ({ row }) => (
      isLoading ? <Skeleton  animation="wave" height={30} /> :
      <div className="capitalize text-center">{row.getValue("level")}</div>
    ),
  },
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton  animation="wave" height={30} /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );},
    cell: ({ row }) => (
      isLoading ? <Skeleton  animation="wave" height={30} /> : 
      <div className="capitalize text-center">{row.getValue("time")}</div>
    ),
  },
  {
    accessorKey: "fees_type",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton  animation="wave" height={30} /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fees-Type
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );},
    cell: ({ row }) => (
      isLoading ? <Skeleton  animation="wave" height={30} /> : 
      <div className="capitalize text-center">{row.getValue("fees_type")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton  animation="wave" height={30} /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );},
    cell: ({ row }) => {
      if (isLoading) {
        return <Skeleton  animation="wave" height={30} />;
      }
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-EG", {
        style: "currency",
        currency: "EGP",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "payment_date",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton  animation="wave" height={30} /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment-Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );},
    cell: ({ row }) => {
      if (isLoading) {
        return <Skeleton  animation="wave" height={30} />;
      }
      let formatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      let date = row.getValue("payment_date");
      let formattedDate = formatter.format(date).replace(/\//g, '-'); 
      return <div className="capitalize text-center">{formattedDate}</div>;
    },
  },
  // {
  //   header: isLoading ? <Skeleton  animation="wave" height={30} /> : '',
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     if (isLoading) {
  //       return <Skeleton />;
  //     }
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <DotsHorizontalIcon className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
])
}
