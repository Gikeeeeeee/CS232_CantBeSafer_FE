"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/axios"; 


// กำหนด Interface สำหรับข้อมูล Report ที่ได้จาก Backend
interface IncidentReport {
  report_id: number;
  report_title: string;
  address?: string;
  location_name?: string;
}

export const InAppNotification = () => {
  // แก้ปัญหาตัวแดง: ระบุชัดเจนว่าเป็น Set ของ number
  const [knownReportIds, setKnownReportIds] = useState<Set<number>>(new Set<number>());
  const [latestAlert, setLatestAlert] = useState<IncidentReport | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchActiveReports = useCallback(async () => {
    try {
      // ยิงไปที่ Endpoint ที่เราเช็คจาก Controller ของนาย
      const response = await api.get("/report/active-map");
      
      if (response.data && response.data.success) {
        const reports: IncidentReport[] = response.data.data;
        
        if (reports && reports.length > 0) {
          // ดึง ID ออกมาและบังคับให้เป็น number เสมอ
          const currentIds = new Set<number>(reports.map(r => Number(r.report_id)));
          
          if (!isInitialLoad) {
            // หาเหตุการณ์ใหม่ที่ไม่อยู่ใน Set เดิม
            const newReports = reports.filter(r => !knownReportIds.has(Number(r.report_id)));
            
            if (newReports.length > 0) {
              setLatestAlert(newReports[0]);
              setIsVisible(true);
              
              // ซ่อนแจ้งเตือนหลังจาก 8 วินาที
              setTimeout(() => {
                setIsVisible(false);
              }, 8000);
            }
          }

          // อัปเดตรายชื่อ ID ที่เรารู้จักแล้ว
          setKnownReportIds(currentIds);
        }
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error("In-App Notification Fetch Error:", error);
    }
  }, [knownReportIds, isInitialLoad]);

  useEffect(() => {
    fetchActiveReports();
    // เช็คทุกๆ 10 วินาที
    const intervalId = setInterval(fetchActiveReports, 10000);
    return () => clearInterval(intervalId);
  }, [fetchActiveReports]);

  if (!isVisible || !latestAlert) return null;

  return (
    <>
      {/* ฝัง CSS Animation ไว้ในตัวเลย จะได้ไม่ต้องแก้หลายไฟล์ */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink-bar {
          animation: shrinkBar 8s linear forwards;
        }
      `}} />

      <div className="fixed top-24 right-6 z-[9999] transition-all duration-500 ease-in-out">
        <div 
          className="bg-white border-l-4 border-red-600 shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-r-lg p-4 w-80 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setIsVisible(false)}
        >
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-full text-xl">
              🚨
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">เกิดเหตุแจ้งเตือนใหม่!</p>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {latestAlert.report_title}
              </p>
              {(latestAlert.location_name || latestAlert.address) && (
                <p className="text-[10px] text-red-500 mt-2 font-medium flex items-center gap-1">
                  📍 {latestAlert.location_name || latestAlert.address}
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar ด้านล่าง */}
          <div className="mt-4 bg-slate-100 h-1 w-full rounded-full overflow-hidden">
            <div className="bg-red-500 h-full animate-shrink-bar"></div>
          </div>
          
          <p className="text-[9px] text-slate-400 mt-2 text-right">คลิกเพื่อปิด</p>
        </div>
      </div>
    </>
  );
};