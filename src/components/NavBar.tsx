"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ใช้เช็คว่าอยู่หน้าไหนเพื่อทำปุ่มสีเข้ม/อ่อน
import { MapPin, PlusCircle, UserCircle } from 'lucide-react';

const BottomNav = () => {
  const pathname = usePathname();

  // ฟังก์ชันเช็คความ Active ของปุ่ม
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      
      {/* Location */}
      <Link href="/user/home" className="flex flex-col items-center gap-1 group">
        <div className={`p-2 rounded-full transition-colors ${isActive('/user/home') ? 'bg-gray-200' : 'bg-transparent'}`}>
          <MapPin className={`w-6 h-6 ${isActive('/user/home') ? 'text-black' : 'text-gray-400'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/user/home') ? 'text-black' : 'text-gray-400'}`}>Location</span>
      </Link>

      {/* Report */}
      <Link href="/user/report" className="flex flex-col items-center gap-1 group">
        <PlusCircle className={`w-8 h-8 ${isActive('/user/report') ? 'text-black' : 'text-gray-400'}`} />
        <span className={`text-[10px] font-bold ${isActive('/user/report') ? 'text-black' : 'text-gray-400'}`}>Report</span>
      </Link>

      {/* My account */}
      <Link href="/user/profile" className="flex flex-col items-center gap-1 group">
        <UserCircle className={`w-8 h-8 ${isActive('/user/profile') ? 'text-black' : 'text-gray-400'}`} />
        <span className={`text-[10px] font-bold ${isActive('/user/profile') ? 'text-black' : 'text-gray-400'}`}>My account</span>
      </Link>
      
    </nav>
  );
};

export default BottomNav;