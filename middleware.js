// export {default} from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    // redirect user to registeration if user is not admin
    // console.log('req.url::: ', req.nextUrl.pathname == '/registration');
    if (token && token.user.username !== 'admin' && req.nextUrl.pathname !== '/registration') {
      return NextResponse.redirect(new URL('/registration', req.url));
    }
    return NextResponse.next();
  }

)

export const config = {
    matcher: ['/', '/api', '/dashboard', '/registration', '/register']
  }