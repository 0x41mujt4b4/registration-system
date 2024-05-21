"use client";
import { signOut } from "next-auth/react";

export default function Logout() {
    return (
        <li>
            <button onClick={() => signOut()} className="block py-3 text-center text-gray-300 hover:text-indigo-600 border rounded-lg md:border-none">
                Log out
            </button>
        </li> 
    );
}