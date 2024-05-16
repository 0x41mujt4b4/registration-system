"use client";
import React from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import "@/app/globals.css";


export default function Dashboard() {
    const cookies = new Cookies();
    const router = useRouter()
    const handleClick = () => {
        cookies.set('loggedIn', false);
        router.push('/login');
    };
    return (
        <div className='container mx-auto flex flex-col min-h-screen justify-center items-center'>
            <h1 className="text-4xl text-white font-bold">Welcome to the Dashboard Page</h1>
            <p className="text-white font-bold">This is the content of the Dashboard page.</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>Sign out</button>
        </div>
    );
}