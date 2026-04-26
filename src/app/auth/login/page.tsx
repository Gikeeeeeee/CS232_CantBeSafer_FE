"use client";

import React, { useState } from 'react';
import { loginService } from '@/services/loginService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import Button from '@/components/Button';
import { jwtDecode } from 'jwt-decode';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  const [Username, setUsername] = useState<string>('');
  const [Password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = { username: Username, password: Password };
      // 🚀 ยิง API จริง
      const response = await loginService.postLogin(payload);

      // ดึง token ตามโครงสร้าง response.data.token
      const token = response.data?.token;

      if (token) {
        const decoded: any = jwtDecode(token);
        const userRole = decoded.role || decoded.Role || response.data.user?.role || 'user';

        const userData = {
          user_id: decoded.id || 0,
          name: Username,
          role: userRole,
          dome_mail: decoded.email || '',
          is_active: true
        };

        login(userData, token);

        // 🎯 สั่ง Store เก็บลง Cookie และ LocalStorage (Zustand จัดการให้)
        login(userData, token);

        // Hard Refresh เพื่อให้ Middleware ทำงานใหม่
        if (userRole === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/user/home';
        }
      } else {
        setError("ไม่ได้รับ Token จากเซิร์ฟเวอร์");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  }; // ปิด handleLogin

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-none md:shadow-2xl p-10 md:p-12">
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
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-black bg-white"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-800">Password</label>
            <input
              type="password"
              placeholder="**********"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-black bg-white"
              disabled={isLoading}
              required
            />
          </div>

          <div className="pt-4 space-y-3">
            <Button type="submit" disabled={isLoading} className="space-y-6">
              {isLoading ? 'Checking...' : 'Login'}
            </Button>
            <Link href="/auth/signup" className="block text-center w-full bg-white border border-gray-200 text-gray-800 font-medium py-3 rounded-lg">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;