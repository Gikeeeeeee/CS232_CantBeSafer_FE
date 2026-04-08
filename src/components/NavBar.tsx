"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store'; // เชื่อม Store ที่คุณให้มา

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  // ดึงฟังก์ชัน logout มาจาก Zustand Store ของคุณ
  const { logout } = useAuthStore();

  const navItems = [
    { id: 'location', label: 'Location', icon: '📍', path: '/user/home' },
    { id: 'report', label: 'Report', icon: '➕', path: '/user/report' },
    { id: 'account', label: 'My account', icon: '👤', path: '/user/profile' },
  ];

  const handleLogout = () => {
    logout(); // ตัวนี้จะไปรัน deleteCookie และล้าง State ตามที่คุณเขียนไว้ใน store
    router.replace('/auth/login'); // ดีดออกไปหน้า login
  };

  return (
    <>
      {/* --- MOBILE: Bottom Navbar --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-around items-center z-50 h-[75px]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-1 min-w-[70px]"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              pathname === item.path ? 'bg-gray-200' : 'active:bg-gray-100'
            }`}>
              <span className="text-xl">{item.icon}</span>
            </div>
            <span className={`text-[11px] font-bold ${
              pathname === item.path ? 'text-black' : 'text-gray-400'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* --- IPAD/DESKTOP: Side Navbar (Pill Shape ตามรูป navbar(1).png) --- */}
      <nav className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.1)] py-10 px-3 flex-col items-center gap-12 z-50">
        {/* เรียงตามรูป: Account อยู่บนสุด */}
        {navItems.slice().reverse().map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-1 group w-full"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              pathname === item.path ? 'bg-gray-200' : 'group-hover:bg-gray-100'
            }`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <span className={`text-[11px] font-bold text-center leading-tight max-w-[55px] ${
              pathname === item.path ? 'text-black' : 'text-gray-400'
            }`}>
              {item.label}
            </span>
          </button>
        ))}

        {/* ปุ่ม Logout ที่เรียกใช้ Store */}
        <button 
          onClick={handleLogout}
          className="mt-4 text-[10px] text-red-400 font-bold hover:text-red-600 transition-colors uppercase tracking-wider"
        >
          Logout
        </button>
      </nav>
    </>
  );
};

export default Navbar;