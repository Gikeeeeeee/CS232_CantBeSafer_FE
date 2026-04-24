// src/app/admin/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "DASHBOARD", path: "/admin/dashboard" },
    // { name: "REPORTS", path: "/admin/reports" },
  ];

  return (
    <>
      <head>
        <link rel="preconnect" href="https://maps.geo.ap-southeast-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://maps.geo.ap-southeast-1.amazonaws.com" />
      </head>

      <div className="flex h-screen w-full bg-[var(--background)] overflow-hidden font-sans">
        
        {/* Sidebar: Premium Minimal Clean */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          
          {/* Top: Branding (เพิ่มเส้นขอบบางๆ แยกส่วนหัว) */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <h1 className="text-xl font-black tracking-widest text-slate-900">
              TU<span className="text-blue-600">.</span>THREAT
            </h1>
          </div>

          {/* Middle: Menu (อยู่ตรงกลาง แต่มีกรอบพื้นหลังให้ดูเป็นปุ่ม) */}
          <nav className="flex-1 flex flex-col justify-center px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.name} href={item.path}>
                  <div
                    className={`flex items-center w-full px-5 py-3.5 rounded-xl text-xs font-bold tracking-[0.2em] transition-all duration-200 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md" // สีดำตัดขาว ให้ความรู้สึกหนักแน่น ดุดัน
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-900" // เวลาเอาเมาส์ชี้จะมีสีเทาอ่อนๆ รองพื้น
                    }`}
                  >
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom: Logout (ทำให้เป็นปุ่มกว้างเต็มพื้นที่แทนที่จะเป็นตัวอักษรลอยๆ) */}
          <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center justify-center px-4 py-3.5 text-xs font-bold tracking-[0.2em] text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
              LOGOUT
            </button>
          </div>

        </aside>

        {/* Main Content Area: ใช้สีเทาอ่อนจางๆ (slate-50) เพื่อตัดกับ Sidebar สีขาว */}
        <main className="flex-1 relative bg-slate-50">
          {children}
        </main>

      </div>
    </>
  );
}