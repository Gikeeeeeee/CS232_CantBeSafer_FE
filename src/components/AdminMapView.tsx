"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle } from "react-leaflet";

type Report = {
  id: number;
  lat: number;
  lng: number;
  location: string;
  description: string;
  image: null;
  status: string;
};

type AdminMapViewProps = {
  reports?: Report[];
  onMarkerClick?: (report: Report) => void;
};

const getStatusColor = (status: string) => {
  if (status === "Emergency") return "#9333ea";
  if (status === "Urgent") return "#ff3b3b";
  if (status === "Normal") return "#ffb800";
  if (status === "Resolved") return "#2563eb";
  return "#1a1a1a";
};

const AdminMapView = ({ reports = [], onMarkerClick }: AdminMapViewProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
        center={[14.0700, 100.6050]}
        zoom={16}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
          const color = getStatusColor(report.status);
          return (
            <React.Fragment key={report.id}>
              {report.status !== "Resolved" && (
                <Circle
                  center={[report.lat, report.lng]}
                  radius={80}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.15,
                    weight: 1,
                  }}
                />
              )}
              <CircleMarker
                center={[report.lat, report.lng]}
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