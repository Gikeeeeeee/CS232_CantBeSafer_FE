"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { getIncidentMarkers } from "@/services/reportService";

const MapView = () => {
  const [isMounted, setIsMounted] = useState(false); // เช็คว่า Component พร้อมทำงานหรือยัง
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // 1. บอกว่า Component ติดตั้งเสร็จแล้ว
    setIsMounted(true);
    
    // 2. โหลด CSS ของ Leaflet
    import("leaflet/dist/leaflet.css");

    // 3. ดึงข้อมูล
    const fetchData = async () => {
      try {
        const data = await getIncidentMarkers();
        setMarkers(data);
      } catch (err) {
        console.error("Fetch data error:", err);
      }
    };
    fetchData();

    // Cleanup: เมื่อ Component ถูกถอนออก ให้ตั้งเป็น false
    return () => setIsMounted(false);
  }, []);

  const getStatusColor = (status: string) => {
    const s = status ? status.toUpperCase() : "NORMAL";
    if (s === "EMERGENCY") return "#9333ea"; 
    if (s === "URGENT") return "#ff3b3b";    
    if (s === "RESOLVED") return "#2563eb";  
    return "#ffb800"; 
  };

  const createCustomIcon = (status: string) => {
    const color = getStatusColor(status);
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  // 4. ถ้ายังไม่ Mounted หรือกำลังโหลด ให้โชว์ Loading (ป้องกัน appendChild error)
  if (!isMounted) return (
    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
      <p>Loading Map...</p>
    </div>
  );

  return (
    <div className="w-full h-full relative"> {/* ใส่ div หุ้มเพื่อความชัวร์ */}
      <MapContainer
        key={isMounted ? "map-ready" : "map-loading"} // ใช้ Key เพื่อบังคับให้ Render ใหม่ครั้งเดียว
        center={[14.0700, 100.6050]}
        zoom={16}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((item) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          
          // เช็คพิกัดว่ามีค่าจริงๆ ไหม ป้องกัน Error
          if (isNaN(lat) || isNaN(lng)) return null;

          const position: [number, number] = [lat, lng];
          const mainColor = getStatusColor(item.status);

          return (
            <React.Fragment key={item.id}>
              <Circle
                center={position}
                radius={150}
                pathOptions={{
                  color: mainColor,
                  fillColor: mainColor,
                  fillOpacity: 0.2,
                  weight: 1
                }}
              />
              <Marker position={position} icon={createCustomIcon(item.status)}>
                <Popup>
                  <div className="font-sans text-black min-w-[120px]">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-xs">{item.description}</p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;