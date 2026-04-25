"use client";

import React, { useEffect, useState, useRef } from "react";
import DashboardView from '@/components/admin/dashboardView';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/axios';
import { IncidentEvent } from '@/types/map';

export default function AdminDashboardPage() {
  const { logout } = useAuthStore();
  const [incidents, setIncidents] = useState<IncidentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลจาก Backend (ดึงจากตัวที่นายส่งมาให้ดู)
  const fetchIncidents = async () => {
    try {
      const response = await api.get("/report/admin-active-map");
      if (response.data.success) {
        // Mapping ข้อมูลจาก Backend ให้เข้ากับ Interface ของ Frontend
        const formattedData: IncidentEvent[] = response.data.data.map((item: any) => ({
          id: item.report_id,
          lat: Number(item.latitude),
          lng: Number(item.longitude),
          title: item.report_title,
          type: item.report_title, // หรือแมพตามประเภทถ้ามี
          severity: item.urgency_score as any,
          status: item.report_status as any,
          address: item.address
        }));
        setIncidents(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ดึงข้อมูลครั้งแรก และตั้งเวลาอัปเดตทุก 10 วินาที (Sync กับ Notification)
  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 1. ส่วนแสดงผล Dashboard (ที่ข้างในมี IncidentMap) */}
      <DashboardView 
        events={incidents} 
        isLoading={isLoading} 
        onRefresh={fetchIncidents} 
      />

      {/* 2. ปุ่ม Logout (เอาไว้มุมนึงของจอเพื่อไม่ให้บังแผนที่) */}
      <button 
        onClick={handleLogout}
        className="absolute bottom-10 left-6 z-[50] px-4 py-2 bg-white/90 backdrop-blur-md text-red-500 border border-red-100 rounded-full text-xs font-bold shadow-lg hover:bg-red-50 transition-all active:scale-95"
      >
        LOGOUT
      </button>
    </div>
  );
}