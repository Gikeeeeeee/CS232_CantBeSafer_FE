"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const MapView = () => {
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    import("leaflet/dist/leaflet.css").then(() => setCssLoaded(true));
  }, []);

  if (!cssLoaded) return (
    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
      <p className="text-gray-500">กำลังโหลดแผนที่...</p>
    </div>
  );

  return (
    <MapContainer
      key="map"
      center={[14.0700, 100.6050]}
      zoom={16}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default MapView;