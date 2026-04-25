"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle } from "react-leaflet";

// 1. ปรับ Type ให้ตรงกับ JSON จาก Backend
type Report = {
  report_id: number;
  location: {
    latitude: number;
    longitude: number;
  };
  location_name: string;
  report_description: string;
  evidence_url: string | null;
  report_status: string;
  urgency_score: number;
};

type AdminMapViewProps = {
  reports?: Report[];
  onMarkerClick?: (report: Report) => void;
};

// 2. ปรับ Logic การดึงสีตาม report_status จริงในระบบ
const getStatusColor = (status: string, urgency_score: number) => {
  if (status === "reported") return "#1a1a1a";   // ดำ = ยังไม่อนุมัติ
  if (status === "resolved") return "#2563eb";   // น้ำเงิน = resolved
  if (status === "in_progress") {
    if (urgency_score === 3) return "#9333ea";   // ม่วง = Emergency
    if (urgency_score === 2) return "#ff3b3b";   // แดง = Urgent
    return "#ffb800";                            // เหลือง = Normal
  }
  return "#1a1a1a";
};

const AdminMapView = ({ reports = [], onMarkerClick }: AdminMapViewProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // โหลด CSS ของ Leaflet
    import("leaflet/dist/leaflet.css");
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return (
    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
      <p>Loading Map...</p>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      <MapContainer
        key={isMounted ? "admin-map-ready" : "admin-map-loading"}
        center={[14.0700, 100.6050]} // ศูนย์กลาง มธ. รังสิต
        zoom={16}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
          // ดึงพิกัดจาก object location
          const lat = report.location?.latitude;
          const lng = report.location?.longitude;
          const color = getStatusColor(report.report_status, report.urgency_score);

          // ตรวจสอบว่ามีพิกัดครบถ้วนก่อนวาดบนแผนที่
          if (lat === undefined || lng === undefined) return null;

          return (
            <React.Fragment key={report.report_id}>
              {/* วาดวงรัศมีถ้ายังไม่เสร็จสิ้น */}
              {report.report_status !== "Resolved" && (
                <Circle
                  center={[lat, lng]}
                  radius={80}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.15,
                    weight: 1,
                  }}
                />
              )}
              {/* จุด Marker หลัก */}
              <CircleMarker
                center={[lat, lng]}
                radius={10}
                pathOptions={{
                  color: "white",
                  fillColor: color,
                  fillOpacity: 1,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => onMarkerClick?.(report),
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AdminMapView;