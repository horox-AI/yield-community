import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log('Middleware running for path:', req.nextUrl.pathname);

  if (req.nextUrl.pathname.endsWith('/page')) {
    const newUrl = req.nextUrl.pathname.replace(/\/page$/, '');
    console.log('Removing /page from URL. New path:', newUrl);
    return NextResponse.redirect(new URL(newUrl, req.url));
  }

  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const publicPaths = ["/signin", "/join"];
  const protectedPaths = ["/profile", "/create-post", "/edit-post"];
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname);
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  console.log('Is public path:', isPublicPath, 'Is protected path:', isProtectedPath, 'Has token:', !!token);

  if (isPublicPath && token) {
    console.log('Redirecting authenticated user from public path to home');
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isProtectedPath && !token) {
    console.log('Redirecting unauthenticated user to signin');
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  console.log('Allowing request to proceed for path:', req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/join",
    "/",
    "/posts/:path*",
    "/profile",
    "/create-post",
    "/edit-post",
  ],
};