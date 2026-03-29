"use client";

import React, { useState } from 'react';
import { loginService } from '@/src/services/loginService';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage: React.FC = () => { // ลบ async ออกจากตรงนี้
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const payload = { username, password };
      const response = await loginService.postLogin(payload);
      
      // เก็บ Token ลงคุกกี้เพื่อให้ API client ตัวอื่นดึงไปใช้ได้
      if (response.data.token) {
        setCookie('auth-token', response.data.token);
      }
      
      router.push('/dashboard'); 
    } catch (err: any) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6">
      
      {/* Card: ปรับความกว้างให้เหมาะกับ Mobile (max-w-xs ถึง max-w-sm) */}
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-none md:shadow-2xl p-10 md:p-12 transition-all">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          {/* Error Message: ตามดีไซน์จะอยู่ใต้หัวข้อ Login ทันที */}
          {error && (
            <p className="text-red-500 text-[13px] mt-2 font-medium">
              {error}
            </p>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
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

          {/* Password */}
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

          {/* Buttons */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00e676] hover:bg-[#00c853] text-gray-800 font-bold py-3 rounded-lg transition-all active:scale-[0.98] shadow-md"
            >
              {isLoading ? 'Checking...' : 'Login'}
            </button>
            
            <Link href="/signup">
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