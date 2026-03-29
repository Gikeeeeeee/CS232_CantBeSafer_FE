"use client";

import React, { useState } from 'react';
import { loginService } from '@/services/loginService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/auth-store';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
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
      
      const token = response.data.token;
      
      if (token) {
        // กรณีที่ API ของเพื่อนยังไม่ได้ส่งข้อมูล User กลับมาครบตาม Type ที่เรากำหนดไว้
        // เราจะสร้าง Mock Data ขึ้นมาใช้งานชั่วคราวเพื่อให้ระบบ State ทำงานได้
        const user = response.data.user || {
          user_id: 1,
          name: username,
          dome_mail: `${username}@dome.tu.ac.th`,
          role: 'user', 
          is_active: true,
          department_id: 1
        };

        // เรียกใช้งาน Store เพื่อเก็บ Token ลง Cookie และเก็บข้อมูล User ลง LocalStorage
        login(user, token);
        
        router.push('/dashboard'); 
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Invalid username or password');
        console.error('Login Failed:', err.response?.data);
      } else {
        setError('Something went wrong. Please try again.');
        console.error('Unknown Error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6">
      
      {/* Card */}
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-none md:shadow-2xl p-10 md:p-12 transition-all">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          {/* Error Message */}
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