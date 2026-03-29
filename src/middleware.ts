import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const role = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // 1. ถ้าไม่มี Token ห้ามเข้าหน้าระบบ
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/user'))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 2. ป้องกันข้าม Role
  if (role === 'admin' && pathname.startsWith('/user')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (role === 'user' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/user', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
};