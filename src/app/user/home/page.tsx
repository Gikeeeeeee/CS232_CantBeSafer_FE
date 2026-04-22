"use client";

import React, { useEffect, useState } from 'react';
import BottomNav from '@/components/NavBar';
import { Search, Navigation } from 'lucide-react';
import { fetchActiveIncidentPoints } from '@/services/locationService';

const HomePage = () => {
  const [reports, setReports] = useState<any[]>([]);

  // 1. ดึงข้อมูลจาก Backend ผ่าน Service ที่เราเขียนไว้
  useEffect(() => {
    const loadData = async () => {
      const response = await fetchActiveIncidentPoints();
      if (response.success) {
        setReports(response.data);
      }
    };
    loadData();
  }, []);

  // 2. ฟังก์ชันเลือกสีตามความรุนแรง (Urgency Score)
  const getStatusColor = (score: number, status: string) => {
    if (status.toLowerCase() === 'resolved') return 'bg-blue-600'; // Resolved
    if (score >= 5) return 'bg-purple-600'; // Emergency
    if (score >= 3) return 'bg-red-600';    // Urgent
    return 'bg-yellow-600';                // Normal
  };

  const getPulseColor = (score: number, status: string) => {
    if (status.toLowerCase() === 'resolved') return 'bg-blue-400/40 border-blue-400';
    if (score >= 5) return 'bg-purple-400/40 border-purple-400';
    if (score >= 3) return 'bg-red-400/40 border-red-400';
    return 'bg-yellow-400/40 border-yellow-400';
  };

  return (
    <div className="relative min-h-screen bg-[#e5e7eb] overflow-hidden flex flex-col">
      
      {/* 1. Map Area (ในอนาคตเอา AWS Map ไปใส่ในนี้) */}
      <div className="absolute inset-0 z-0 bg-[#add8e6] bg-cover bg-center">
        <div className="absolute inset-0 bg-blue-100/30"></div>

        {/* --- Render Markers จากข้อมูลจริง --- */}
        {reports.map((report) => (
          <div 
            key={report.report_id}
            className="absolute transition-all duration-500"
            style={{
              // วิธีนี้เป็นการจำลองตำแหน่งบนหน้าจอ ถ้าใช้ Map จริงต้องใช้ setLngLat ของ MapLibre
              top: `${((14.08 - report.location.latitude) * 5000) + 50}%`, 
              left: `${((report.location.longitude - 100.60) * 5000) + 50}%`,
            }}
          >
            <div className="flex items-center justify-center relative">
              {/* วงกลมรัศมี (Radius) */}
              <div className={`w-16 h-16 rounded-full border-2 animate-pulse ${getPulseColor(report.urgency_score, report.report_status)}`}></div>
              {/* จุด Center */}
              <div className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-lg ${getStatusColor(report.urgency_score, report.report_status)}`}></div>
              
              {/* ป้ายชื่อ (Tooltip เล็กๆ) */}
              <div className="absolute top-[-25px] whitespace-nowrap bg-white/80 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
                {report.report_title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Status Filters Overlay (Top Left) */}
      <div className="absolute top-6 left-4 z-10 flex flex-col gap-2">
        <div className="bg-[#9333ea] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg uppercase tracking-tight">Emergency</div>
        <div className="bg-[#ff3b3b] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg uppercase tracking-tight">Urgent</div>
        <div className="bg-[#ffb800] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg uppercase tracking-tight">Normal</div>
        <div className="bg-[#2563eb] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg uppercase tracking-tight">Resolved</div>
      </div>

      {/* 3. Navigation Button */}
      <div className="absolute bottom-24 right-4 z-10">
        <button className="p-3 bg-white rounded-full shadow-xl text-gray-700 active:scale-90 transition-transform">
          <Navigation className="w-6 h-6" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;