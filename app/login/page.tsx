"use client";
import { useState, useEffect } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toUserFriendlyErrorMessage } from "@/lib/graphql-client";
import { getPostLoginPath } from "@/lib/permissions";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    void getSession().then((s) => {
      router.push(getPostLoginPath(s?.user?.permissions ?? [], s?.user?.role, s?.user?.isMasterTenant));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const response = await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirect: false,
      });

      if (response?.error) {
        if (response.error === "CredentialsSignin") {
          setLoginError("Invalid username/email or password.");
        } else {
          setLoginError(toUserFriendlyErrorMessage(new Error(response.error)));
        }
        setIsLoading(false);
        return;
      }

      if (response?.ok) {
        const s = await getSession();
        router.push(getPostLoginPath(s?.user?.permissions ?? [], s?.user?.role, s?.user?.isMasterTenant));
        router.refresh();
      } else {
        setIsLoading(false);
        setLoginError("Wrong username or password. Please try again.");
      }
    } catch {
      setIsLoading(false);
      setLoginError("Unable to sign in right now. Please try again.");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center px-4 py-8">
      <div className="surface-elevated w-full max-w-xl rounded-2xl px-6 py-10 sm:px-10">
        <div className="flex flex-col items-center">
          <Image
            src="/vision_logo.png"
            alt="vision logo"
            width={112}
            height={112}
            className="mx-auto h-28 w-auto"
          />
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-700">Sign in to continue to the registration system.</p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className="font-medium text-black">Username</label>
            <input
              name="username"
              type="text"
              id="username"
              required
              className="w-full mt-2 px-3 py-2 text-black bg-white outline-none border focus:border-sky-600 shadow-sm rounded-lg"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-medium text-black">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              required
              className="w-full mt-2 px-3 py-2 text-black bg-white outline-none border focus:border-sky-600 shadow-sm rounded-lg"
              autoComplete="current-password"
            />
          </div>
          {loginError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{loginError}</p>
          )}
          <button
            disabled={isLoading}
            className={`w-full px-4 py-2 text-white font-medium bg-sky-600 hover:bg-sky-500 active:bg-sky-600 rounded-lg duration-150 ${isLoading ? "bg-sky-300 hover:bg-sky-300 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
