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
import { Skeleton } from "@radix-ui/themes";

export default function Columns({isLoading}) {
  return (
  [
  {
    accessorKey: "id",
    header: ({ column }) => (
      isLoading ? <Skeleton /> :
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => isLoading ? <Skeleton /> : <div className="lowercase ml-6">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        isLoading ? <Skeleton /> :
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => isLoading ? <Skeleton /> : <div className="font-serif font-medium text-lg">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "session",
    header: isLoading ? <Skeleton /> : "Session",
    cell: ({ row }) => (
      isLoading ? <Skeleton /> :
      <div className="capitalize ">{row.getValue("session")}</div>
    ),
  },
  {
    accessorKey: "course",
    header: isLoading ? <Skeleton /> : "Course",
    cell: ({ row }) => (isLoading ? <Skeleton /> : 
      <div className="capitalize">{row.getValue("course")}</div>
    ),
  },
  {
    accessorKey: "level",
    header: isLoading ? <Skeleton /> : "Level",
    cell: ({ row }) => (
      isLoading ? <Skeleton /> :
      <div className="capitalize">{row.getValue("level")}</div>
    ),
  },
  {
    accessorKey: "time",
    header: isLoading ? <Skeleton /> : "Time",
    cell: ({ row }) => (
      isLoading ? <Skeleton /> : 
      <div className="capitalize">{row.getValue("time")}</div>
    ),
  },
  {
    accessorKey: "fees_type",
    header: isLoading ? <Skeleton /> : "Fees-Type",
    cell: ({ row }) => (
      isLoading ? <Skeleton /> : 
      <div className="capitalize">{row.getValue("fees_type")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => isLoading ? <Skeleton /> : <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      if (isLoading) {
        return <Skeleton />;
      }
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-EG", {
        style: "currency",
        currency: "EGP",
      }).format(amount);

      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "payment_date",
    header: isLoading ? <Skeleton /> : "Payment-Date",
    cell: ({ row }) => {
      if (isLoading) {
        return <Skeleton />;
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
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  // {
  //   header: isLoading ? <Skeleton /> : '',
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
