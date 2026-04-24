// src/components/admin/DashboardView.tsx
"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IncidentEvent } from '@/types/map';

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

const MOCK_INCIDENTS: IncidentEvent[] = [
  { id: '1', lat: 14.0650, lng: 100.6147, status: 'approved', severity: 3, title: 'เพลิงไหม้ตึก บร.4', type: 'Emergency' },
  { id: '2', lat: 14.0680, lng: 100.6100, status: 'pending', severity: 0, title: 'พบวัตถุต้องสงสัย หน้า SC', type: 'Unset' },
  { id: '3', lat: 14.0620, lng: 100.6200, status: 'approved', severity: 2, title: 'อุบัติเหตุรถเฉี่ยวชน', type: 'Urgent' },
];

export default function DashboardView() {
  const [incidents, setIncidents] = useState<IncidentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // จำลองจังหวะดึงข้อมูลจาก DB
    const timer = setTimeout(() => {
      setIncidents(MOCK_INCIDENTS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full bg-white">
      {!isLoading ? (
        <MapComponent events={incidents} />
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