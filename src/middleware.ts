import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
  // 1. ดึง Token ดิบจาก Cookie (รหัส eyJhbG...)
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Path: ${pathname} | Has Token: ${!!token}`);

  // 2. กำหนดกลุ่ม Path
  const isAuthPage = pathname.startsWith('/auth'); // /auth/login, /auth/register
  const isPublicPage = pathname === '/'; // หน้าแรก

  // --- LOGIC หลัก ---

  // กรณีที่ 1: ไม่มี Token และจะเข้าหน้าที่ต้อง Login
  if (!token) {
    if (!isAuthPage && !isPublicPage) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // กรณีที่ 2: มี Token แล้ว
  try {
    // 🛑 สำคัญ: jwtDecode ใช้กับรหัสเพียวๆ เท่านั้น ถ้ามี Bearer นำหน้าต้องตัดออกก่อน
    const rawToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded: any = jwtDecode(rawToken);

    // ดึง Role จาก Token (หรือจาก Cookie สำรองถ้าใน Token ไม่มี)
    const role = decoded.role || decoded.Role || request.cookies.get('user-role')?.value;

    // A. ถ้า Login แล้วแต่จะไปหน้า Auth (Login/Register) -> ดีดออกไปหน้าตาม Role
    if (isAuthPage) {
      const destination = role === 'admin' ? '/admin/dashboard' : '/user/home';
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // B. ระบบป้องกันการข้ามสายงาน (Role Protection)
    // เป็น Admin แต่จะเข้าหน้า User
    if (pathname.startsWith('/user') && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // ถ้าเป็น User แต่พยายามเข้าหน้า /admin
    if (pathname.startsWith('/admin') && role !== 'admin' && role !== 'dev') {
      // เปลี่ยนจาก /user/home เป็นหน้าที่มีอยู่จริง (เช่น /user/profile)
      return NextResponse.redirect(new URL('/user/profile', request.url));
    }

  } catch (error) {
    // ถ้า Token ปลอม, เละ, หรือ Decode ไม่ผ่าน -> ล้าง Cookie แล้วเตะไป Login
    console.error("❌ Middleware Token Error:", error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('auth-token');
    response.cookies.delete('user-role');
    return response;
  }

  return NextResponse.next();
}

// 3. กำหนดขอบเขตการทำงาน (Matcher)
export const config = {
  matcher: [
    /*
     * ตรวจสอบทุก Path ยกเว้น:
     * - api (Next.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};