// src/components/admin/dashboardView.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import IncidentDetailPanel from "@/components/admin/IncidentDetailPanel"; 
import AdminProfile from "@/components/admin/AdminProfile"; 
import { getIncidentMarkers } from "@/services/reportService"; 
import { useAuth } from "@/hooks/useAuth"; // ✅ นำเข้า Hook ของเรา

const AdminMapView = dynamic(() => import("@/components/admin/IncidentMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center animate-pulse">
      <div className="flex gap-2 opacity-40 mb-2">
        <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
        <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
        <div className="h-1 w-1 bg-slate-900 rounded-full"></div>
      </div>
      <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">Loading Command Center</p>
    </div>
  ),
});

export default function DashboardView() {
  const { user } = useAuth(); 

  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [mapKey, setMapKey] = useState(0);

  const fetchReports = useCallback(async () => {
    try {
      const rawData = await getIncidentMarkers(); 

      const formattedData = rawData.map((item) => ({
        ...item,
        id: String(item.id),
        lat: Number(item.latitude),
        lng: Number(item.longitude),
        severity: item.urgency_score,
        type: item.urgency_score === 3 ? "Emergency" : item.urgency_score === 2 ? "Urgent" : "Normal",
        
        report_id: item.id,
        report_title: item.title,
        report_description: item.description,
        report_status: item.status,
        evidence_url: item.image_url,
      }));

      setReports(formattedData);
      setMapKey((prev) => prev + 1); 
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchReports(); 
  }, [fetchReports]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-50">
      
      {/* Layer 1: แผนที่หลัก */}
      <div className="absolute inset-0 z-0">
        <AdminMapView
          key={mapKey}
          events={reports} 
          onMarkerClick={(report: any) => setSelectedReport(report)} 
          currentUser={user || undefined} // ส่งต่อให้ Map 
        />
      </div>

      {/* Layer 2: Admin Profile */}
      <div className="absolute top-6 right-6 z-10">
        <AdminProfile user={user} /> {/* โยน User (ที่อาจจะเป็น null) ไปให้มันจัดการเอง */}
      </div>

      {/* Layer 3: Incident Details Panel */}
      {selectedReport && (
        <IncidentDetailPanel 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
          onUpdateSuccess={() => {
            fetchReports(); 
            setSelectedReport(null); 
          }} 
        />
      )}

    </div>
  );
}