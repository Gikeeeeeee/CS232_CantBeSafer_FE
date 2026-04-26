"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, PlusCircle, UserCircle } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // สร้าง Component ย่อยสำหรับปุ่ม เพื่อลดโค้ดที่ซ้ำซ้อนและจัดการ Active State ที่เดียว
  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => {
    const active = isActive(path);
    return (
      <Link 
        href={path} 
        className="group flex flex-col items-center gap-1.5 w-16"
      >
        <div className={`
          flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
          ${active 
            ? 'bg-slate-900 text-white shadow-md scale-105' 
            : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-800'
          }
        `}>
          <Icon className={`transition-transform duration-300 ${active ? 'w-6 h-6' : 'w-7 h-7 group-hover:scale-110'}`} />
        </div>
        <span className={`text-[10px] font-bold transition-colors duration-300 ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-800'}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* --- MOBILE VERSION (Bottom Nav) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-6 pt-3 px-6 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        {/* เรียงลำดับใหม่: Location -> Report -> Account */}
        <NavItem path="/user/home" icon={MapPin} label="Location" />
        <NavItem path="/user/report" icon={PlusCircle} label="Report" />
        <NavItem path="/user/profile" icon={UserCircle} label="Account" />
      </nav>

      {/* --- TABLET/DESKTOP VERSION (Floating Side Nav) --- */}
      <nav className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col items-center justify-center bg-white/80 backdrop-blur-xl z-50 shadow-2xl border border-white/50 py-8 px-3 gap-8 rounded-full">
        {/* เรียงลำดับใหม่: Location (บนสุด) -> Report (กลาง) -> Account (ล่างสุด) */}
        <NavItem path="/user/home" icon={MapPin} label="Location" />
        <NavItem path="/user/report" icon={PlusCircle} label="Report" />
        <NavItem path="/user/profile" icon={UserCircle} label="Account" />
      </nav>
    </>
  );
};

export default Navbar;