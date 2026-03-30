"use client";

import React, { useState } from 'react';
import { loginService } from '@/src/services/loginService';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // --- 1. [Mock Test] สำหรับทดสอบโครงสร้าง Path (ลบทิ้งเมื่อต่อจริง) ---
    if (username === "admin" && password === "123456") {
      setCookie('auth-token', 'mock-token-admin');
      router.push('/dashboard'); // จะวิ่งเข้า (admin)/dashboard/page.tsx
      return;
    }
    if (username === "user" && password === "123456") {
      setCookie('auth-token', 'mock-token-user');
      router.push('/profile'); // จะวิ่งเข้า (user)/profile/page.tsx
      return;
    }

    // --- 2. [Real API] เชื่อมต่อกับ Backend จริง ---
    try {
      const payload = { username, password };
      const response = await loginService.postLogin(payload);
      
      const { token, role } = response.data; // Backend ต้องส่ง token และ role กลับมา

      if (token) {
        setCookie('auth-token', token, { maxAge: 60 * 60 * 24 }); // เก็บไว้ 1 วัน

        // --- แยกเส้นทางตาม Role ที่ได้รับจาก Backend ---
        if (role === 'admin') {
          router.push('/dashboard'); // Path: (admin)/dashboard
        } else if (role === 'user') {
          router.push('/profile');   // Path: (user)/profile
        } else {
          router.push('/'); // กรณี role อื่นๆ ให้ไปหน้าแรก
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // เปลี่ยน bg-white เป็นสีพื้นหลังที่ต้องการ (เช่น bg-[#333333]) เพื่อให้เห็น Card ชัดเจน
    <div className="min-h-screen bg-[#333333] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-none md:shadow-2xl p-10 md:p-12 transition-all">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          {error && <p className="text-red-500 text-[13px] mt-2 font-medium">{error}</p>}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-800">Username</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-600 bg-white shadow-sm"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-800">Password</label>
            <input
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-600 bg-white shadow-sm"
              disabled={isLoading}
              required
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00e676] hover:bg-[#00c853] text-gray-800 font-bold py-3 rounded-lg transition-all active:scale-[0.98] shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Checking...' : 'Login'}
            </button>
            
            <Link href="/auth/signup" className="block w-full">
              <button
                type="button"
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-lg transition-all shadow-sm"
              >
                Sign up
              </button>
            </Link>
          </div>

          <div className="text-center mt-6">
            <a href="#" className="text-sm text-gray-600 hover:underline">Forgot your password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;