"use client";

import React, { useState } from 'react';
import { loginService } from '@/src/services/loginService';

interface LoginProps {
  hasError?: boolean;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // เพิ่ม State สำหรับจัดการ UI ภายในหน้าจอ
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setError(null);      // ล้าง Error เก่าออกก่อนเริ่มใหม่
    // setIsLoading(true);  // แสดงสถานะกำลังโหลด (ป้องกันการกดซ้ำ)
    
    // try {
    //   const payload = { username, password };
    //   //const response = await loginService.postLogin(payload);
      
    //   console.log('Login Success:', response.data);
    //   // ตรงนี้: สั่ง Redirect ไปหน้า Dashboard (เช่น router.push('/dashboard'))
      
    // } catch (err: any) {
    //   console.error('Login Failed:', err);
    //   // เซ็ต Error Message เพื่อให้ UI แสดงสีแดงตามดีไซน์
    //   setError('Invalid username or password');
    // } finally {
    //   setIsLoading(false); // ปิดสถานะโหลดไม่ว่าจะสำเร็จหรือไม่
    // }
  };
return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container: Desktop-First Design */}
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12 transition-all">
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Login</h1>
        
        {/* Error Message Section */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all
              text-gray-500"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-md transition-colors"
            >
              {isLoading ? 'Checking...' : 'Login'}
            </button>
            
            <button
              type="button"
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-2.5 rounded-md transition-colors"
            >
              Sign up
            </button>
          </div>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;