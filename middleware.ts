import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    // redirect user to registeration if user is not admin
    if (token && (token as any).user?.username !== 'admin' && req.nextUrl.pathname !== '/registration') {
      return NextResponse.redirect(new URL('/registration', req.url));
    }
    return NextResponse.next();
  }
)

export const config = {
    matcher: ['/', '/api', '/dashboard', '/registration', '/register']
  }