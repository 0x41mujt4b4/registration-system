"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Spinner } from "@radix-ui/themes";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Logout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <span className="px-4">
        <Spinner size="3" className="text-sky-900" />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      className="flex items-center gap-2 rounded-lg border bg-sky-600 px-3 py-1 text-white transition-colors hover:bg-white hover:text-sky-600 md:border-none"
    >
      <PowerIcon className="h-5 w-5" />
      <span>Logout</span>
    </button>
  );
}