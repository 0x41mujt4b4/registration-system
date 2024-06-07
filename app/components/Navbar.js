"use client";
import { useState, useEffect } from 'react'
// import Cookies from "universal-cookie";
// import { useRouter } from 'next/navigation';
// import { PowerIcon } from "@heroicons/react/24/outline";
// import { signOut } from "@/auth";
// import { getServerSession } from "next-auth/next";
import Logout from "./logout";
import { useSession } from "next-auth/react";
import { dataListItemPropDefs } from '@radix-ui/themes/dist/cjs/components/data-list.props';
// import { options } from "../api/auth/[...nextauth]/options";


export default function Navbar() {
  // const [state, setState] = useState(true)
  // const [isLoggedIn, setIsLoggedIn] = useState(true)
  const session = useSession();
  // Replace  paths with your paths
  const navigation = [
    { title: "Registration".toUpperCase(), path: "/registration" },
    { title: "Dashboard".toUpperCase(), path: "/dashboard" },
    // { title: "Customers", path: "" },
    // { title: "Pricing", path: "" }
  ];

  // const cookies = new Cookies();
  // const router = useRouter()
  return (
    <nav className="bg-slate-200 border-b border-slate-300 w-full md:static md:text-sm mb-4">
      <div className="flex px-4 mx-auto justify-between">
        <div className="flex items-center justify-between py-3 md:py-2 md:block">
          <a href="/">
            <img
              src="/vision_logo.png"
              alt="vision logo"
              className="h-auto w-10 mx-2" />
          </a>
        </div>
        <div
          className={`flex flex-row`}
        >
          <ul className="items-center flex space-x-6">
            {session.status === 'authenticated' && session.data.user.username === 'admin' ? navigation.map((item, idx) => {
              return (
                <li key={idx} className="text-sky-600 font-bold hover:text-sky-300">
                  <a href={item.path} className="block">
                    {item.title}
                  </a>
                </li>
              );
            }) : ''}
            {session.status === 'authenticated' && session.data.user.username === 'admin'? <span className="hidden w-px h-6 bg-sky-600 md:block"></span> : ''}
            <div className="items-center flex">
              {session.status === 'authenticated' ? (
                    <Logout />
                ) : ''
                // (
                //     <li>
                //         <a href="/login" className="block py-3 text-center text-white hover:text-sky-600 border rounded-lg md:border-none">
                //             Log in
                //         </a>
                //     </li>
                // )
                }
              {/* <li>
                                <a href="" className="block py-3 px-4 font-medium text-center text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 active:shadow-none rounded-lg shadow md:inline">
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
