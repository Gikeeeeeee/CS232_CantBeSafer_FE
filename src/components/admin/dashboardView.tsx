// src/components/admin/dashboardView.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import IncidentDetailPanel from "@/components/admin/IncidentDetailPanel";
import AdminProfile from "@/components/admin/AdminProfile";
import { useAuth } from "@/hooks/useAuth";
import { IncidentEvent } from '@/types/map';

const AdminMapView = dynamic(() => import("@/components/admin/IncidentMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center animate-pulse">
      <p className="text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase">Loading Spatial Engine</p>
    </div>
  ),
});

interface DashboardViewProps {
  events: IncidentEvent[];
  isLoading: boolean;
  onRefresh?: () => void;
  onUpdateStatus: (reportId: number, status: string, urgencyScore: number) => Promise<boolean>;
}

export default function DashboardView({ events, isLoading, onRefresh, onUpdateStatus }: DashboardViewProps) {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-50">
      
      {/* Layer 1: แผนที่หลัก */}
      <div className="absolute inset-0 z-0">
        {!isLoading ? (
          <AdminMapView
            events={events}
            onMarkerClick={(report: any) => setSelectedReport(report)}
            currentUser={user || undefined}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
             <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 animate-pulse uppercase">Syncing Database...</p>
          </div>
        )}
      </div>

      {/* Layer 2: UI Overlays */}
      <div className="absolute top-6 right-6 z-10 flex flex-col items-end gap-3">
        <AdminProfile user={user} />
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 text-[9px] font-bold text-slate-500 hover:text-slate-900 transition-all active:scale-95 uppercase tracking-wider"
          >
            🔄 Sync Now
          </button>
        )}
      </div>

      {/* Layer 3: Incident Details Panel */}
      {selectedReport && (
        <IncidentDetailPanel
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdateStatus={onUpdateStatus} // ✅ ส่งต่อฟังก์ชัน
          onUpdateSuccess={() => {
            if (onRefresh) onRefresh();
            setSelectedReport(null);
          }}
        />
      )}

    </div>
  );
}