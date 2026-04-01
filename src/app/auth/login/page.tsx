"use client";

import React, { useState } from 'react';
import { loginService } from '@/services/loginService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';

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
      const response = await loginService.postLogin(payload);
      
      const { token, role, user } = response.data; 

    if (token && role) {
          console.log("1. ได้ Token กับ Role มาแล้ว:", { token, role });
          
          const userData = { user_id: 0, name: Username, role: role, dome_mail: '', is_active: true };
          login(userData, token);
          
          console.log("2. เก็บข้อมูลลง Store/Cookie สำเร็จ");

          if (role === 'admin') {
            console.log("3. กำลังจะไปหน้า Admin...");
            router.push('/admin/dashboard'); 
          } else {
            console.log("3. กำลังจะไปหน้า User...");
            router.push('/user/profile');
          }
        }
      } catch (err: any) {
        // ดึง Error Message จาก Backend มาแสดง
        setError(err.response?.data?.message || 'Invalid username or password');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6">
      
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-none md:shadow-2xl p-10 md:p-12 transition-all">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          {error && (
            <p className="text-red-500 text-[13px] mt-2 font-medium">
              {error}
            </p>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-800">Username</label>
            <input
              type="text"
              placeholder="username"
              value={Username}
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
              value={Password}
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
            
            <Link href="/auth/signup">
              <button
                type="button"
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-lg transition-all shadow-sm"
              >
                Sign up
              </button>
            </Link>
          </div>

          <div className="text-center mt-6">
            <a href="#" className="text-sm text-gray-600 hover:underline">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;