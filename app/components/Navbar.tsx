"use client";

import Logout from "./logout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { canAccessAdminPanel, canAccessDashboard, canAccessRegistration } from "@/lib/permissions";

export default function Navbar() {
  const { data: session, status } = useSession();
  const permissions = session?.user?.permissions ?? [];
  const role = session?.user?.role;
  const isMasterTenant = session?.user?.isMasterTenant;
  const showRegistration = status === "authenticated" && canAccessRegistration(permissions);
  const showDashboard = status === "authenticated" && canAccessDashboard(permissions);
  const showAdminPanel = status === "authenticated" && canAccessAdminPanel(role, permissions, isMasterTenant);

  return (
    <nav className="mb-4 w-full border-b border-slate-300 bg-slate-200 md:static md:text-sm">
      <div className="mx-auto flex justify-between px-4">
        <div className="flex items-center justify-between py-3 md:block md:py-2">
          <Link href="/">
            <Image
              src="/vision_logo.png"
              alt="vision logo"
              width={40}
              height={40}
              className="mx-2 h-auto w-10"
            />
          </Link>
        </div>
        <div className="flex flex-row">
          <ul className="flex items-center space-x-6">
            {showRegistration ? (
              <li className="font-bold text-sky-600 hover:text-sky-300">
                <Link href="/registration" className="block">
                  REGISTRATION
                </Link>
              </li>
            ) : null}
            {showAdminPanel ? (
              <li className="font-bold text-sky-600 hover:text-sky-300">
                <Link href="/admin-panel" className="block">
                  ADMIN PANEL
                </Link>
              </li>
            ) : null}
            {showRegistration && showDashboard ? <span className="hidden h-6 w-px bg-sky-600 md:block" /> : null}
            {showDashboard ? (
              <li className="font-bold text-sky-600 hover:text-sky-300">
                <Link href="/dashboard" className="block">
                  DASHBOARD
                </Link>
              </li>
            ) : null}
            {(showRegistration || showDashboard) && status === "authenticated" ? (
              <span className="hidden h-6 w-px bg-sky-600 md:block" />
            ) : null}
            <div className="flex items-center">{status === "authenticated" ? <Logout /> : null}</div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
