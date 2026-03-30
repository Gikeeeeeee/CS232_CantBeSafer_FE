// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // ป้องกันการวนลูป: ปล่อยให้เข้าถึงไฟล์ระบบและหน้า Login ได้เสมอ
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') || // ปล่อยให้หน้า login/signup เข้าได้
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // ถ้าไม่มี Token แต่จะเข้าหน้า admin หรือ user ให้ดีดไปหน้า login
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/user'))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // ตรวจสอบทุกหน้ายกเว้นไฟล์ static
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};