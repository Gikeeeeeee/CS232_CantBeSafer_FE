'use client';
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapComponent({ points }: { points: any[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // 1. สร้างแผนที่
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geo.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/maps/v0/maps/${process.env.NEXT_PUBLIC_AWS_MAP_NAME}/style-descriptor?key=${process.env.NEXT_PUBLIC_AWS_MAP_API_KEY}`,
      center: [100.6025, 14.0722], // เริ่มต้นที่ มธ. รังสิต
      zoom: 13
    });

    // 2. วนลูปปักหมุดจากข้อมูลที่เราเตรียมไว้
    points.forEach(point => {
      new maplibregl.Marker()
        .setLngLat([point.location.longitude, point.location.latitude])
        .setPopup(new maplibregl.Popup().setHTML(`<h4>${point.report_title}</h4>`))
        .addTo(map.current!);
    });

    return () => map.current?.remove();
  }, [points]);

  return <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />;
}