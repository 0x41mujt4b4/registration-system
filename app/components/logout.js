"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Spinner } from "@radix-ui/themes";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function Logout() {
    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = async () => {
        setIsLoading(true);
        await signOut();
    }
    return (
        <>
        {
        isLoading ? <span className="px-9"><Spinner
        size="3"
        className="text-sky-900"
      /></span> :
        <li  onClick={async () => await handleLogout()} className="flex gap-2 py-1 px-2 text-white bg-sky-600 hover:bg-white hover:text-sky-600 border rounded-lg md:border-none hover:cursor-pointer">
            <PowerIcon className="w-6 h-6" />
            <span className="flex items-center justify-center text-center">
                Logout
            </span>
        </li>
        }
        </>
    );
}