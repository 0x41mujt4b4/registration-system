"use client";
import { useState, useEffect } from 'react'
// import Cookies from "universal-cookie";
// import { useRouter } from 'next/navigation';
// import { PowerIcon } from "@heroicons/react/24/outline";
// import { signOut } from "@/auth";
// import { getServerSession } from "next-auth/next";
import Logout from "./logout";
import { useSession } from "next-auth/react";
// import { options } from "../api/auth/[...nextauth]/options";


export default function Navbar() {
  // const [state, setState] = useState(true)
  // const [isLoggedIn, setIsLoggedIn] = useState(true)
  const session = useSession();
  // Replace  paths with your paths
  const navigation = [
    { title: "Registration", path: "/registration" },
    // { title: "Integrations", path: "" },
    // { title: "Customers", path: "" },
    // { title: "Pricing", path: "" }
  ];

  // const cookies = new Cookies();
  // const router = useRouter()
  return (
    <nav className="bg-transparent border-b w-full md:static md:text-sm md:border-none">
      <div className="flex px-4 mx-auto justify-between">
        <div className="flex items-center justify-between py-3 md:py-2 md:block">
          <a href="/">
            {/* eslint-disable */}
            <img
              src="https://www.floatui.com/logo.svg"
              width={120}
              height={50}
              alt="Float UI logo"
            />
          </a>
        </div>
        <div
          className={`flex flex-row`}
        >
          <ul className="items-center flex space-x-6">
            {navigation.map((item, idx) => {
              return (
                <li key={idx} className="text-gray-100 hover:text-indigo-600">
                  <a href={item.path} className="block">
                    {item.title}
                  </a>
                </li>
              );
            })}
            {session.status === 'loading' ? '' : <span className="hidden w-px h-6 bg-gray-300 md:block"></span>}
            <div className="items-center flex">
              {session.status === 'loading' ? '' : session.data ? (
                    <Logout />
                ) : (
                    <li>
                        <a href="/login" className="block py-3 text-center text-gray-300 hover:text-indigo-600 border rounded-lg md:border-none">
                            Log in
                        </a>
                    </li>
                )}
              {/* <li>
                                <a href="" className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline">
                                    Sign in
                                </a>
                            </li> */}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
