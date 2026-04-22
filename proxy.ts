import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const username = req.auth?.user?.username;

  if (req.auth && username !== "admin" && req.nextUrl.pathname !== "/registration") {
    return NextResponse.redirect(new URL("/registration", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/dashboard", "/registration", "/register"],
};
