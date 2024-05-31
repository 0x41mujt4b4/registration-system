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
      session.status === 'loading' ? <Loading /> :
      <div className="max-w-sm w-full text-gray-600">
        <div className="text-center">
            {/* eslint-disable-next-line */}
          <img
            src="https://floatui.com/logo.svg"
            width={150}
            className="mx-auto"
          />
          <div className="mt-5 space-y-2">
            <h3 className="text-white text-2xl font-bold sm:text-3xl">
              Vision Center System
            </h3>
            {/* <p className="">Don't have an account? <a href="javascript:void(0)" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a></p> */}
          </div>
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
              className="w-full mt-2 px-3 py-2 text-black bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium text-white">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              required
              className="w-full mt-2 px-3 py-2 text-black bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <button disabled={isLoading} className={`w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 ${isLoading ? 'px-4 py-2 text-sm text-white active:bg-indigo-300 bg-indigo-300 rounded-lg hover:bg-indigo-300 cursor-not-allowed' : ''}`}>
            {isLoading ? <span className="flex items-center justify-center"><Spinner size="3" className="text-blue-200"
      /></span>: 'Sign in'}
          </button>
          {loginError && <Error title={'Login failed: '} message={loginError} setMessage={setLoginError}/>}
          {/* <div className="text-center">
                      <a href="javascript:void(0)" className="hover:text-indigo-600">Forgot password?</a>
                  </div> */}
        </form>
      </div>
}
    </main>
  );
}
