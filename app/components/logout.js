"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Spinner } from "@radix-ui/themes";

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
        className="text-blue-200"
      /> :
        <li>
            <button onClick={() => handleLogout()} className="text-center text-gray-300 hover:text-indigo-600 border rounded-lg md:border-none">
                Log out
            </button>
        </li>
        }
        </>
    );
}