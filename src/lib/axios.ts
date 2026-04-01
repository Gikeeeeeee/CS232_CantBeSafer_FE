import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. ดึง Token จาก Cookie (ชื่อต้องตรงกับที่เซ็ตตอน Login)
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // 2. กำหนด Path ที่เราอนุญาตให้เข้าได้โดยไม่ต้อง Login (Public Routes)
  const isAuthPage = pathname.startsWith('/auth'); // เช่น /auth/login, /auth/register
  const isPublicPage = pathname === '/'; // หน้าแรก (ถ้าอยากให้คนนอกดูได้)

  // --- LOGIC หลัก ---

  // กรณีที่ 1: ถ้า "ไม่มี Token" และ "พยายามเข้าหน้าอื่นที่ไม่ใช่หน้า Auth"
  // ให้ดีดไปหน้า Login ทันที
  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // กรณีที่ 2: ถ้า "มี Token แล้ว" แต่ยัง "พยายามจะไปหน้า Login/Register"
  // ให้ดีดไปหน้า Dashboard หรือหน้าหลัก (เพราะ Login แล้วจะ Login ซ้ำทำไม)
  if (token && isAuthPage) {
    const role = request.cookies.get('user-role')?.value;
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/user/home', request.url));
  }

  return NextResponse.next();
}

// 3. กำหนดว่าจะให้ Middleware ตรวจสอบที่ไหนบ้าง (สำคัญมาก)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};