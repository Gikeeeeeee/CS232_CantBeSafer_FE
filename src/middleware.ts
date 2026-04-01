import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

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
// กรณีที่ 2: มี Token แล้ว
  if (token) {
    let role = request.cookies.get('user-role')?.value;

    // --- เพิ่มการ Decode ตรงนี้เพื่อความชัวร์ ---
    try {
      const decoded: any = jwtDecode(token);
      role = decoded.role || decoded.Role || role; // เช็กทั้งตัวเล็กตัวใหญ่ หรือใช้จาก cookie สำรอง
    } catch (error) {
      // ถ้า decode พัง (Token ปลอม/หมดอายุ) ให้เตะออกไป login
      console.error("JWT Decode Error:", error);
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // ถ้า Login แล้วแต่จะเข้าหน้า Auth (Login/Register) -> ดีดไปหน้าตาม Role
    if (isAuthPage) {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/user/profile', request.url));
    }

    // --- (เพิ่มเติม) ระบบป้องกันการข้ามสายงาน (Role Protection) ---
    // ถ้าเป็น Admin แต่พยายามเข้าหน้า /user
    if (pathname.startsWith('/user') && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // ถ้าเป็น User แต่พยายามเข้าหน้า /admin
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/user/home', request.url));
    }
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