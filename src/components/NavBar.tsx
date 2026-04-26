"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, PlusCircle, UserCircle } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // สไตล์สำหรับ Link Items เพื่อลดโค้ดซ้ำ
  const navItemClasses = (path: string) => `
    flex flex-col items-center gap-1 group transition-all duration-300
    ${isActive(path) ? 'text-black' : 'text-gray-400'}
  `;

  return (
    <>
      {/* --- MOBILE VERSION (ด้านล่าง) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <Link href="/user/home" className={navItemClasses('/user/home')}>
          <div className={`p-2 rounded-full ${isActive('/user/home') ? 'bg-gray-200' : ''}`}>
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">Location</span>
        </Link>

        <Link href="/user/report" className={navItemClasses('/user/report')}>
          <PlusCircle className="w-8 h-8" />
          <span className="text-[10px] font-bold">Report</span>
        </Link>

        <Link href="/user/profile" className={navItemClasses('/user/profile')}>
          <UserCircle className="w-8 h-8" />
          <span className="text-[10px] font-bold">My account</span>
        </Link>
      </nav>

      {/* --- TABLET/IPAD VERSION (แถบแนวตั้งด้านข้างตามรูป) --- */}
      <nav className={`
        hidden md:flex fixed right-6 top-[40%] -translate-y-1/2 
flex-col items-center justify-center
bg-white/95 backdrop-blur-sm 
z-50 shadow-2xl border border-gray-100
h-auto w-[70px] py-8 px-2 gap-6 rounded-[5rem]
        /* ปรับความสูงตามสเกลหน้าจอ และความกว้างให้ผอมลง */
        h-[60vh] max-h-[500px] min-h-[380px] w-[75px]
        py-10 px-2 rounded-[5rem]
      `}>
        
        {/* My Account (อยู่บนสุดตามรูป iPad) */}
        <Link href="/user/profile" className={navItemClasses('/user/profile')}>
          <div className={`p-2 rounded-full transition-colors ${isActive('/user/profile') ? 'bg-gray-100' : ''}`}>
            <UserCircle className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-center">My<br/>account</span>
        </Link>

        {/* Report (อยู่กลาง) */}
        <Link href="/user/report" className={navItemClasses('/user/report')}>
          <div className={`p-2 rounded-full transition-colors ${isActive('/user/report') ? 'bg-gray-100' : ''}`}>
            <PlusCircle className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold">Report</span>
        </Link>

        {/* Location (อยู่ล่าง) */}
        <Link href="/user/home" className={navItemClasses('/user/home')}>
          <div className={`p-3 rounded-full transition-colors ${isActive('/user/home') ? 'bg-gray-200 shadow-inner' : 'bg-gray-100'}`}>
            <MapPin className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold">Location</span>
        </Link>

      </nav>
    </>
  );
};

export default Navbar;