"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import Skeleton from "@mui/material/Skeleton";
import { Button } from "@/components/ui/button";

const headerBtnClass =
  "-ml-2 h-8 px-2 text-left font-semibold text-slate-700 hover:bg-slate-200/80 hover:text-slate-900";

export default function Columns({ isLoading }: { isLoading: boolean }) {
  return [
    {
      accessorKey: "student_number",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Student ID
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <div className="text-center font-medium tabular-nums text-slate-800">
            #{row.getValue("student_number") ?? "—"}
          </div>
        ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <div className="font-medium text-slate-900">{String(row.getValue("name") ?? "—")}</div>
        ),
      enableSorting: true,
    },
    {
      accessorKey: "session",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Session
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <div className="text-center capitalize text-slate-800">{String(row.getValue("session") ?? "—")}</div>
        ),
      enableSorting: true,
    },
    {
      accessorKey: "course",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Course
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <div className="text-center capitalize text-slate-800">{String(row.getValue("course") ?? "—")}</div>
        ),
      enableSorting: true,
    },
    {
      accessorKey: "level",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Level
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <div className="text-center capitalize text-slate-800">{String(row.getValue("level") ?? "—")}</div>
        ),
      enableSorting: true,
    },
    {
      accessorKey: "time",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Time
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <div className="text-center text-slate-800">{String(row.getValue("time") ?? "—")}</div>
        ),
      enableSorting: true,
    },
    {
      accessorKey: "fees_type",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fees type
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <div className="text-center capitalize text-slate-800">{String(row.getValue("fees_type") ?? "—")}</div>
        ),
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Amount
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) => {
        if (isLoading) {
          return <Skeleton animation="wave" height={28} className="rounded-md" />;
        }
        const raw = row.getValue("amount");
        const amount = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
        if (Number.isNaN(amount)) {
          return <div className="text-center text-slate-400">—</div>;
        }
        const formatted = new Intl.NumberFormat("en-EG", {
          style: "currency",
          currency: "EGP",
        }).format(amount);
        return <div className="text-center font-medium tabular-nums text-slate-800">{formatted}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "payment_date",
      header: ({ column }) =>
        isLoading ? (
          <Skeleton animation="wave" height={28} className="rounded-md" />
        ) : (
          <Button variant="ghost" className={headerBtnClass} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Payment date
            <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-70" />
          </Button>
        ),
      cell: ({ row }) => {
        if (isLoading) {
          return <Skeleton animation="wave" height={28} className="rounded-md" />;
        }
        const raw = row.getValue("payment_date");
        if (!raw) return <div className="text-center text-slate-400">—</div>;
        const date = new Date(raw as string);
        if (Number.isNaN(date.getTime())) return <div className="text-center text-slate-400">—</div>;
        const formatter = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const formattedDate = formatter.format(date).replace(/\//g, "-");
        return <div className="text-center text-sm tabular-nums text-slate-800">{formattedDate}</div>;
      },
      enableSorting: true,
    },
  ];
}
