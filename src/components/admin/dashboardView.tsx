"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { IncidentEvent } from '@/types/map';

// [แก้ไข] เพิ่ม onRefresh เข้าไปใน Interface
interface DashboardViewProps {
  events: IncidentEvent[];
  isLoading: boolean;
  onRefresh?: () => void; // <--- เพิ่มบรรทัดนี้ครับ
}

const MapComponent = dynamic(() => import('@/components/admin/IncidentMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="flex gap-2 opacity-20">
          <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
          <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
          <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
        </div>
        <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">Initialising System</p>
      </div>
    </div>
  )
});

// [แก้ไข] รับ onRefresh มาในฟังก์ชันด้วย
export default function DashboardView({ events, isLoading, onRefresh }: DashboardViewProps) {
  
  return (
    <div className="h-full w-full bg-white relative">
      {!isLoading ? (
        <>
          <MapComponent events={events} />
          {/* [แถม] ปุ่ม Refresh เล็กๆ บนหน้าจอ เผื่อ Admin อยากกดเอง */}
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="absolute top-6 right-6 z-50 bg-white/80 p-2 rounded-md shadow-sm hover:bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider transition-all"
            >
              🔄 Sync Now
            </button>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
           <div className="flex flex-col items-center gap-4 animate-pulse">
            <p className="text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase">Syncing Database</p>
          </div>
        </div>
      )}
    </div>
  );
}