"use client";

import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { getIncidentMarkers } from "@/services/reportService";
import { Flame, AlertTriangle, Info, HelpCircle, CheckCircle2, Crosshair, X } from "lucide-react";

export default function MapView() {
  const mapRef = useRef<MapRef>(null);
  const [reportMarkers, setReportMarkers] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const responseData = await getIncidentMarkers();
        const rawArray = Array.isArray(responseData) ? responseData : ((responseData as any)?.data || []);

        if (Array.isArray(rawArray) && rawArray.length > 0) {
          const formattedData = rawArray.map((item: any) => {
            const lat = Number(item.location?.latitude || item.latitude);
            const lng = Number(item.location?.longitude || item.longitude);
            const title = item.report_title || item.title || "ไม่มีชื่อเรื่อง";
            const description = item.report_description || item.description || "ไม่มีรายละเอียดเพิ่มเติม";
            const id = item.report_id || item.id;
            const status = item.report_status?.toLowerCase() || item.status?.toLowerCase();
            const score = Number(item.urgency_score) || 1;

            return {
              ...item,
              id: String(id),
              title,
              description,
              lat,
              lng,
              severity: score > 3 ? 3 : score,
              status,
            };
          }).filter((item: any) => !isNaN(item.lat) && !isNaN(item.lng));

          setReportMarkers(formattedData);
        } else {
          setReportMarkers([]);
        }
      } catch (err) {
        console.error("Fetch data error:", err);
        setReportMarkers([]);
      }
    };
    
    fetchMapData();
  }, []);

  const refocus = () => {
    if (userLocation) {
      mapRef.current?.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 16,
        bearing: 0,
        pitch: 0,
        essential: true,
        speed: 1.5
      });
    } else {
      mapRef.current?.flyTo({ center: [100.6050, 14.0700], zoom: 15 });
    }
  };

  return (
    <div className="w-full h-full relative flex">
      <div className="flex-1 relative">
        <Map
          ref={mapRef}
          initialViewState={{ longitude: 100.6050, latitude: 14.0700, zoom: 15 }}
          mapStyle={`https://maps.geo.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/maps/v0/maps/${process.env.NEXT_PUBLIC_AWS_MAP_NAME}/style-descriptor?key=${process.env.NEXT_PUBLIC_AWS_MAP_API_KEY}`}
          style={{ width: "100%", height: "100%" }}
        >
          {reportMarkers.map((markerItem) => (
            <Marker
              key={markerItem.id}
              longitude={markerItem.lng}
              latitude={markerItem.lat}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedIncident(markerItem);
                mapRef.current?.flyTo({ center: [markerItem.lng, markerItem.lat], zoom: 16 });
              }}
            >
              <div className="relative cursor-pointer group z-10">
                {markerItem.severity >= 2 && markerItem.status !== "resolved" && (
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${markerItem.severity === 3 ? "bg-red-500" : "bg-orange-500"}`}></div>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-110 ${getSeverityColor(markerItem.severity, markerItem.status)}`}>
                  {getSeverityIcon(markerItem.severity, markerItem.status)}
                </div>
              </div>
            </Marker>
          ))}

          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
              <div className="relative flex items-center justify-center">
                <div className="absolute w-10 h-10 bg-blue-500/20 rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-xl"></div>
              </div>
            </Marker>
          )}
        </Map>

        <button
          onClick={refocus}
          className="absolute bottom-[100px] right-4 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all active:scale-95 z-20"
        >
          <Crosshair size={20} strokeWidth={2.5} />
        </button>
      </div>

      {selectedIncident && (
        <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 z-50 flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-900 line-clamp-1">{selectedIncident.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${getSeverityColor(selectedIncident.severity, selectedIncident.status)}`}>
                  {selectedIncident.status === 'resolved' ? 'แก้ไขแล้ว' : 
                   selectedIncident.severity === 3 ? 'EMERGENCY' : 
                   selectedIncident.severity === 2 ? 'URGENT' : 'NORMAL'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Case #{selectedIncident.id}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedIncident(null)}
              className="p-1 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
          
          <p className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg mt-1">
            {selectedIncident.description}
          </p>
        </div>
      )}
    </div>
  );
}

function getSeverityColor(severity: number, status: string) {
  if (status === 'resolved') return 'bg-blue-600';
  if (status === 'reported') return 'bg-slate-800';
  switch (severity) {
    case 3: return 'bg-red-600';
    case 2: return 'bg-orange-500';
    case 1: return 'bg-amber-400';
    default: return 'bg-slate-400';
  }
}

function getSeverityIcon(severity: number, status: string) {
  const iconProps = { size: 14, color: "white", strokeWidth: 3 };
  if (status === 'resolved') return <CheckCircle2 {...iconProps} />;
  if (status === 'reported') return <HelpCircle {...iconProps} />;
  switch (severity) {
    case 3: return <Flame {...iconProps} />;
    case 2: return <AlertTriangle {...iconProps} />;
    case 1: return <Info {...iconProps} />;
    default: return <HelpCircle {...iconProps} />;
  }
}