"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
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
      if (response?.ok) {
        router.push("/dashboard");
      } else {
        setIsLoading(false);
        setLoginError("Wrong username or password. Please try again.");
      }
    } catch {
      setIsLoading(false);
      setLoginError("An error occurred. Please try again.");
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full bg bg-slate-300 bg-opacity-75 backdrop-filter backdrop-blur-lg shadow-lg rounded-2xl py-11 px-16">
        <div className="flex flex-col items-center">
          <Image
            src="/vision_logo.png"
            alt="vision logo"
            width={112}
            height={112}
            className="mx-auto h-28 w-auto"
          />
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="font-medium text-black">Username</label>
            <input
              name="username"
              type="text"
              id="username"
              required
              className="w-full mt-2 px-3 py-2 text-black bg-white outline-none border focus:border-sky-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium text-black">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              required
              className="w-full mt-2 px-3 py-2 text-black bg-white outline-none border focus:border-sky-600 shadow-sm rounded-lg"
            />
          </div>
          {loginError && (
            <p className="text-red-600 text-sm">{loginError}</p>
          )}
          <button
            disabled={isLoading}
            className={`w-full px-4 py-2 text-white font-medium bg-sky-600 hover:bg-sky-500 active:bg-sky-600 rounded-lg duration-150 ${
              isLoading ? "bg-sky-300 hover:bg-sky-300 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
