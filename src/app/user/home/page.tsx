"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import BottomNav from '@/components/NavBar';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
      <p className="text-gray-500">กำลังโหลดแผนที่...</p>
    </div>
  ),
});

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0">
        <MapView />
      </div>
      <div className="absolute top-6 left-4 z-10 flex flex-col gap-2">
        <button className="bg-[#9333ea] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform w-fit uppercase tracking-tight">Emergency</button>
        <button className="bg-[#ff3b3b] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform w-fit uppercase tracking-tight">Urgent</button>
        <button className="bg-[#ffb800] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform w-fit uppercase tracking-tight">Normal</button>
        <button className="bg-[#2563eb] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform w-fit uppercase tracking-tight">Resolved</button>
      </div>
      <BottomNav />
    </div>
  );
};

export default HomePage;