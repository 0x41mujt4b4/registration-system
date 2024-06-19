"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";
// import { Spinner } from "@radix-ui/themes";
import Error from "../components/error";
import { useSession } from "next-auth/react";
import Loading from "../components/loading";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
    // eslint-disable-next-line
  }, [status]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    try {
      const response = await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirect: false,
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        setIsLoading(false);
        setLoginError("wrong username or password. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setLoginError("An error occurred. Please try again.");
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full bg bg-slate-300 bg-opacity-75 backdrop-filter backdrop-blur-lg shadow-lg rounded-2xl py-11 px-16">
        <div className="flex flex-col items-center">
          {/* eslint-disable */}
          <img
            src="/vision_logo.png"
            alt="vision logo"
            className="mx-auto h-28 w-auto"
          />
          {/* <div className="mt-5 space-y-2">
            <h3 className="text-white text-2xl font-bold sm:text-3xl">
              Vision Center System
            </h3>
            <p className="">Don't have an account? <a href="javascript:void(0)" className="font-medium text-sky-600 hover:text-sky-500">Sign up</a></p>
          </div> */}
        </div>
        <form
          onSubmit={handleLogin}
          //   action={handleLogin}
          className="mt-8 space-y-5"
        >
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
          <button
            disabled={isLoading}
            className={`w-full px-4 py-2 text-white font-medium bg-sky-600 hover:bg-sky-500 active:bg-sky-600 rounded-lg duration-150 ${
              isLoading
                ? "px-4 py-2 text-white active:bg-sky-300 bg-sky-300 rounded-lg hover:bg-sky-300 cursor-not-allowed"
                : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Spinner className="text-white animate-spin py-3" />
              </span>
            ) : (
              "Sign in"
            )}
          </button>
          {loginError && (
            <Error
              title={"Login failed: "}
              message={loginError}
              setMessage={setLoginError}
            />
          )}
          {/* <div className="text-center">
                      <a href="javascript:void(0)" className="hover:text-sky-600">Forgot password?</a>
                  </div> */}
        </form>
      </div>
    </main>
  );
}
