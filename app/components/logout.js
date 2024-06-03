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
        isLoading ? <Spinner
        size="3"
        className="text-purple-950 animate-spin"
      /> :
        <li className="flex gap-2 py-1 px-2 text-white bg-sky-600 hover:bg-white hover:text-sky-600 border rounded-lg md:border-none hover:cursor-pointer">
            <PowerIcon className="w-6 h-6" />
            <button onClick={() => handleLogout()} className="text-center ">
                Logout
            </button>
        </li>
        }
        </>
    );
}