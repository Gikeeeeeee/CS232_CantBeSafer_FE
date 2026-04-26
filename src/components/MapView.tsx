"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { getIncidentMarkers } from "@/services/reportService";

const MapView = () => {
  const [reportMarkers, setReportMarkers] = useState<any[]>([]);

  useEffect(() => {
    import("leaflet/dist/leaflet.css");

    const fetchMapData = async () => {
      try {
        const responseData = await getIncidentMarkers();
        setReportMarkers(responseData);
      } catch (err) {
        console.error("Fetch data error:", err);
      }
    };
    fetchMapData();
  }, []);

  const getMarkerColor = (urgencyScore: number, reportStatus: string) => {
    if (reportStatus === "RESOLVED" || reportStatus === "resolved") return "#2563eb"; 
    if (urgencyScore === 3) return "#9333ea"; 
    if (urgencyScore === 2) return "#ff3b3b"; 
    return "#ffb800";                          
  };

  const createMapIcon = (urgencyScore: number, reportStatus: string) => {
    const pinColor = getMarkerColor(urgencyScore, reportStatus);
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${pinColor}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[14.0700, 100.6050]}
        zoom={16}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reportMarkers.map((markerItem) => {
          const latitudeNum = parseFloat(markerItem.latitude);
          const longitudeNum = parseFloat(markerItem.longitude);
          
          if (isNaN(latitudeNum) || isNaN(longitudeNum)) return null;

          const coordinates: [number, number] = [latitudeNum, longitudeNum];
          
          const score = Number(markerItem.urgency_score);
          const displayColor = getMarkerColor(score, markerItem.status);

          let severityText = "NORMAL";
          let severityClass = "text-amber-500"; 

          if (score === 3) {
            severityText = "EMERGENCY";
            severityClass = "text-purple-600";
          } else if (score === 2) {
            severityText = "URGENT";
            severityClass = "text-red-500";
          }

          return (
            <React.Fragment key={markerItem.id}>
              <Circle
                center={coordinates}
                radius={150}
                pathOptions={{
                  color: displayColor,
                  fillColor: displayColor,
                  fillOpacity: 0.2,
                  weight: 1
                }}
              />
              <Marker position={coordinates} icon={createMapIcon(score, markerItem.status)}>
                <Popup>
                  <div className="font-sans text-black min-w-[120px]">
                    <h3 className="font-bold">{markerItem.title}</h3>
                    <p className="text-xs">{markerItem.description}</p>
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center">
                       ความรุนแรงระดับ: 
                       <span className={`ml-1 font-bold ${severityClass}`}>
                         {severityText}
                       </span>
                       {(markerItem.status === 'resolved' || markerItem.status === 'RESOLVED') && (
                         <span className="text-blue-600 font-bold ml-1">(แก้ไขแล้ว)</span>
                       )}
                    </p>
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