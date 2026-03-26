"use client";

import React, { useState } from 'react';

interface LoginProps {
  hasError?: boolean;
}

const LoginPage: React.FC<LoginProps> = ({ hasError = false }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { username, password });
  };
return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container: Desktop-First Design */}
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12 transition-all">
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Login</h1>
        
        {/* Error Message Section */}
        {hasError && (
          <p className="text-red-500 text-sm text-center mb-4 animate-pulse">
            Invalid username or password
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
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-md transition-colors"
            >
              Login
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