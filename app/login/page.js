"use client";
// import React from 'react';
// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
// import getUser from '@/server/getUser';
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
// import Spinner from "../components/Spinner";
import { Spinner } from "@radix-ui/themes";
import Error from "../components/error";
import { useSession } from "next-auth/react";
import Loading from "../components/loading";

export default function Login() {
  const session = useSession();
  const router = useRouter();
  const [isLoading , setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const response = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });
    if (response.ok) {
      // redirect('/dashboard');
      router.push("/dashboard");
      router.refresh();
      console.log("response: ", response);
    }
    else {
      setIsLoading(false);
      setLoginError('wrong username or password. Please try again.');
    }
  };

  // const [state, formAction] = useFormState(checkUser, initialState);
  return (
    <main className="w-full flex flex-col items-center justify-center px-4">
    {
      session.status === 'authenticated' ? router.push('/') :
      <div className="max-w-md w-full bg bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg py-8 px-16">
        <div className="flex flex-col items-center">
        <img
              src="/vision_logo.png"
              alt="vision logo"
              className="mx-auto h-28 w-auto" />
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
            <label className="font-medium text-white">Username</label>
            <input
              name="username"
              type="text"
              id="username"
              required
              className="w-full mt-2 px-3 py-2 text-black bg-white outline-none border focus:border-sky-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium text-white">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              required
              className="w-full mt-2 px-3 py-2 text-black bg-white outline-none border focus:border-sky-600 shadow-sm rounded-lg"
            />
          </div>
          <button disabled={isLoading} className={`w-full px-4 py-2 text-white font-medium bg-sky-600 hover:bg-sky-500 active:bg-sky-600 rounded-lg duration-150 ${isLoading ? 'px-4 py-2 text-white active:bg-sky-300 bg-sky-300 rounded-lg hover:bg-sky-300 cursor-not-allowed' : ''}`}>
            {isLoading ? <span className="flex items-center justify-center"><Spinner size="3" className="text-white"
      /></span>: 'Sign in'}
          </button>
          {loginError && <Error title={'Login failed: '} message={loginError} setMessage={setLoginError}/>}
          {/* <div className="text-center">
                      <a href="javascript:void(0)" className="hover:text-sky-600">Forgot password?</a>
                  </div> */}
        </form>
      </div>
}
    </main>
  );
}
