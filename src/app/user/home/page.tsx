"use client";

import React from 'react';
import BottomNav from '@/components/NavBar';
import { Search, MoreVertical, Navigation } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-[#e5e7eb] overflow-hidden flex flex-col">
      
      {/* 1. Map Background (Mockup Area) */}
      <div className="absolute inset-0 z-0 bg-[#add8e6] bg-[url('https://www.google.com/maps/d/thumbnail?mid=1_ZInNqG_Bv-m_6rVb2y8GfA5H7M&msa=0')] bg-cover bg-center">
        {/* เลเยอร์สีฟ้าอ่อนทับแผนที่เพื่อให้ UI ดูละมุนเหมือนในรูป */}
        <div className="absolute inset-0 bg-blue-100/30"></div>

        {/* --- Mock Markers (รัศมีวงกลมตามรูป) --- */}
        
        {/* Purple Marker (Lower Manhattan) */}
        <div className="absolute top-[25%] right-[20%] flex items-center justify-center">
          <div className="w-24 h-24 bg-purple-400/40 rounded-full border-2 border-purple-400 animate-pulse"></div>
          <div className="absolute w-3 h-3 bg-purple-600 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        {/* Red Marker (New York Center) */}
        <div className="absolute top-[40%] left-[45%] flex items-center justify-center">
          <div className="w-20 h-20 bg-red-400/40 rounded-full border-2 border-red-400"></div>
          <div className="absolute w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        {/* Yellow Markers (Brooklyn area) */}
        <div className="absolute bottom-[35%] right-[30%] flex items-center justify-center">
          <div className="w-16 h-16 bg-yellow-400/40 rounded-full border-2 border-yellow-400"></div>
          <div className="absolute w-3 h-3 bg-yellow-600 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        <div className="absolute bottom-[25%] left-[55%] flex items-center justify-center">
          <div className="w-14 h-14 bg-yellow-400/40 rounded-full border-2 border-yellow-400"></div>
          <div className="absolute w-3 h-3 bg-yellow-600 rounded-full border-2 border-white shadow-lg"></div>
        </div>
      </div>

      {/* 2. Status Filters Overlay (Top Left) */}
      <div className="absolute top-6 left-4 z-10 flex flex-col gap-2">
        <button className="bg-[#9333ea] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform w-fit uppercase tracking-tight">
          Emergency
        </button>
        <button className="bg-[#ff3b3b] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform w-fit uppercase tracking-tight">
          Urgent
        </button>
        <button className="bg-[#ffb800] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform w-fit uppercase tracking-tight">
          Normal
        </button>
        <button className="bg-[#2563eb] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform w-fit uppercase tracking-tight">
          Resolved
        </button>
      </div>

      {/* 3. Floating Action Buttons (Optional - เพิ่มความสมจริง) */}
      <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-3">
        <button className="p-3 bg-white rounded-full shadow-xl text-gray-700">
          <Navigation className="w-6 h-6" />
        </button>
      </div>

      {/* 4. Bottom Navigation Component */}
      <BottomNav />

    </div>
  );
};

export default HomePage;