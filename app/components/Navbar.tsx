"use client";
import { useState } from "react";
import Logout from "./logout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAdmin = status === "authenticated" && session?.user?.username === "admin";

  const navigation = [
    { title: "Registration".toUpperCase(), path: "/registration" },
    { title: "Dashboard".toUpperCase(), path: "/dashboard" },
  ];

  return (
    <nav className="bg-slate-200 border-b border-slate-300 w-full md:static md:text-sm mb-4">
      <div className="flex px-4 mx-auto justify-between">
        <div className="flex items-center justify-between py-3 md:py-2 md:block">
          <Link href="/">
            <Image
              src="/vision_logo.png"
              alt="vision logo"
              width={40}
              height={40}
              className="h-auto w-10 mx-2"
            />
          </Link>
        </div>
        <div className="flex flex-row">
          <ul className="items-center flex space-x-6">
            {isAdmin
              ? navigation.map((item, idx) => (
                  <li key={idx} className="text-sky-600 font-bold hover:text-sky-300">
                    <Link href={item.path} className="block">
                      {item.title}
                    </Link>
                  </li>
                ))
              : ""}
            {isAdmin && (
              <span className="hidden w-px h-6 bg-sky-600 md:block"></span>
            )}
            <div className="items-center flex">
              {status === "authenticated" ? <Logout /> : ""}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
