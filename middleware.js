// import { NextResponse } from "next/server";
// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
// export default NextAuth(authConfig).auth;
export {default} from 'next-auth/middleware';

// export function middleware(req) {
//   // console.log('session: ', session);
//   if (false) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
// }

export const config = {
    matcher: ['/', '/dashboard', '/registration', '/register']
  }