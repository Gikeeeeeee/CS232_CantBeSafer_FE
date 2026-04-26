// src/components/admin/IncidentMap.tsx
"use client";

import React, { useState, useMemo, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'; // [เพิ่ม] forwardRef, useImperativeHandle
import Map, { Marker, NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { IncidentEvent } from '@/types/map';
import { User } from '@/types/auth';
import { Flame, AlertTriangle, Info, HelpCircle, CheckCircle2, Crosshair } from 'lucide-react';

interface MapProps {
  events: IncidentEvent[];
  currentUser?: User;
}

// [แก้ไข] หุ้ม Component ด้วย forwardRef เพื่อให้ข้างนอก (เช่น หน้า Dashboard) สั่งงานเข้ามาได้
const IncidentMap = forwardRef((props: MapProps, ref) => {
  const { events, currentUser } = props;
  const mapRef = useRef<MapRef>(null);
  const [adminLocation, setAdminLocation] = useState<{ lat: number, lng: number } | null>(null);


  const [selectedIncident, setSelectedIncident] = useState<IncidentEvent | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // =========================================
  // [ส่วนที่เพิ่มใหม่ 1] ฟังก์ชันสั่งงานจากภายนอก
  // =========================================
  useImperativeHandle(ref, () => ({
    // สั่งให้แผนที่บินไปหาพิกัดที่ต้องการ (ใช้ตอนกดดูแจ้งเตือน)
    flyToIncident: (lat: number, lng: number) => {
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 17,
        essential: true,
        speed: 1.5
      });
    }
  }));

  // Auto-location: ดึงพิกัดเมื่อโหลดเว็บ (โค้ดเดิมของนาย)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setAdminLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  const toggleFilter = (label: string) => {
    setActiveFilters(prev =>
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
    );
  };

  const filteredEvents = useMemo(() => {
    if (activeFilters.length === 0) return events;
    return events.filter(e => activeFilters.includes(e.type) || (activeFilters.includes('Unset') && e.status === 'pending'));
  }, [events, activeFilters]);

  const refocus = () => {
    if (adminLocation) {
      mapRef.current?.flyTo({ center: [adminLocation.lng, adminLocation.lat], zoom: 16 });
    }
  };

  return (
    <div className="w-full h-full relative flex">
      <div className="flex-1 relative">
        <Map
          ref={mapRef}
          initialViewState={{ longitude: 100.6147, latitude: 14.0650, zoom: 15 }}
          mapStyle={`https://maps.geo.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/maps/v0/maps/${process.env.NEXT_PUBLIC_AWS_MAP_NAME}/style-descriptor?key=${process.env.NEXT_PUBLIC_AWS_MAP_API_KEY}`}
          style={{ width: '100%', height: '100%' }}
        >
          {filteredEvents.map((event) => (
            <Marker
              key={event.id}
              longitude={event.lng}
              latitude={event.lat}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedIncident(event);
                console.log("Clicked Case:", event.id);
              }}
            >
              <div className="relative cursor-pointer group">
                {(event.severity >= 2 && event.status !== 'resolved') && (
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${event.severity === 3 ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-110 ${getSeverityColor(event)}`}>
                  {getSeverityIcon(event)}
                </div>
              </div>
            </Marker>
          ))}

          {adminLocation && (
            <Marker longitude={adminLocation.lng} latitude={adminLocation.lat}>
              <div className="relative flex items-center justify-center">
                <div className="absolute w-10 h-10 bg-blue-500/20 rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-xl"></div>
              </div>
            </Marker>
          )}
        </Map>

        {/* UI Overlay: Filters (โค้ดเดิมของนาย) */}
        <div className="absolute top-6 left-6 flex flex-wrap gap-2 max-w-md">
          {['Emergency', 'Urgent', 'Normal', 'Unset', 'Resolved'].map(label => (
            <button
              key={label}
              onClick={() => toggleFilter(label)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${activeFilters.includes(label) ? 'bg-slate-900 text-white shadow-lg' : 'bg-white/90 text-slate-400 hover:text-slate-900 backdrop-blur-md shadow-sm'
                }`}
            >
              {label.toUpperCase()}
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={() => setActiveFilters([])}
              className="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            >
              CLEAR
            </button>
          )}
        </div>

        <button
          onClick={refocus}
          className="absolute bottom-10 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-all active:scale-95"
        >
          <Crosshair size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* [เพิ่ม] แสดง Sidebar รายละเอียดถ้ามีการเลือกหมุด (ทำโครงไว้รอเพื่อน) */}
      {selectedIncident && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white p-4 rounded-xl shadow-2xl border border-slate-200 z-50 flex justify-between items-center animate-in slide-in-from-bottom-5">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Case ID: {selectedIncident.id}</h4>
            <p className="text-xs text-slate-500 truncate max-w-[200px]">{selectedIncident.type}</p>
          </div>
          <button
            onClick={() => setSelectedIncident(null)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            CLOSE
          </button>
        </div>
      )}
    </div>
  );
});

// ตั้งชื่อให้ Component (TypeScript/ESLint แนะนำให้ทำเมื่อใช้ forwardRef)
IncidentMap.displayName = "IncidentMap";

export default IncidentMap;

// Helper Functions ของนาย (คงเดิมทั้งหมด)
function getSeverityColor(event: IncidentEvent) {
  if (event.status === 'resolved') return 'bg-blue-600';
  if (event.status === 'pending') return 'bg-slate-800';
  switch (event.severity) {
    case 3: return 'bg-red-600';
    case 2: return 'bg-orange-500';
    case 1: return 'bg-amber-400';
    default: return 'bg-slate-400';
  }
}

function getSeverityIcon(event: IncidentEvent) {
  const iconProps = { size: 14, color: "white", strokeWidth: 3 };
  if (event.status === 'resolved') return <CheckCircle2 {...iconProps} />;
  if (event.status === 'pending') return <HelpCircle {...iconProps} />;
  switch (event.severity) {
    case 3: return <Flame {...iconProps} />;
    case 2: return <AlertTriangle {...iconProps} />;
    case 1: return <Info {...iconProps} />;
    default: return <HelpCircle {...iconProps} />;
  }
}