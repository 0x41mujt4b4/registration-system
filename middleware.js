import { NextResponse } from "next/server";
// import NextAuth from 'next-auth';
// import { authConfig } from "./auth.config";

// export default NextAuth(authConfig).auth;

export function middleware(req) {
  const verify = req.cookies.get("loggedIn");
  console.log("value: ", !verify.value);

  if (verify.value === "false") {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
    matcher: ['/', '/dashboard']
  }