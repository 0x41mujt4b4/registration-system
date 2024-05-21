"use client";
// import React from 'react';
// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
// import getUser from '@/server/getUser';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
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
  };

  // const [state, formAction] = useFormState(checkUser, initialState);
  return (
    <main className="w-full flex flex-col items-center justify-center px-4">
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
          <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
            Sign in
          </button>
          {/* <div className="text-center">
                      <a href="javascript:void(0)" className="hover:text-indigo-600">Forgot password?</a>
                  </div> */}
        </form>
      </div>
    </main>
  );
}
