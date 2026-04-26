"use client";

import React, { useEffect, useState } from "react";
import DashboardView from '@/components/admin/dashboardView';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/axios';
import { IncidentEvent } from '@/types/map';

export default function AdminDashboardPage() {
  const { logout } = useAuthStore();
  const [incidents, setIncidents] = useState<IncidentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. ฟังก์ชันดึงข้อมูลเหตุการณ์ทั้งหมด
  const fetchIncidents = async () => {
    try {
      const response = await api.get("api/reports/admin-active-map");
      if (response.data.success) {
        const formattedData: IncidentEvent[] = response.data.data.map((item: any) => ({
          id: item.report_id,
          description: item.report_description,
          lat: Number(item.location?.latitude),
          lng: Number(item.location?.longitude),
          title: item.report_title,
          type: item.report_title,
          severity: item.urgency_score as any,
          status: item.report_status as any,
          address: item.location?.address || "Thammasat University"
        }));
        setIncidents(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. ฟังก์ชันอัปเดตสถานะ
  const handleUpdateStatus = async (reportId: number, status: string, urgencyScore: number) => {
    try {
      const response = await api.patch(`/api/reports/incidents/${reportId}/status`, {
        status: status,
        urgency_score: urgencyScore
      });

      if (response.status === 200) {
        alert("อัปเดตสถานะสำเร็จ!");
        await fetchIncidents();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Update Status Error:", error);
      alert("เกิดข้อผิดพลาด: " + (error.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"));
      return false;
    }
  };

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
      <DashboardView
        events={incidents}
        isLoading={isLoading}
        onRefresh={fetchIncidents}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}