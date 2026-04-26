import { api } from "../lib/axios";

export interface IncidentMarker {
  id: number;
  title: string;
  description: string;
  latitude: number | string; 
  longitude: number | string;
  urgency_score: number;
  image_url: string;
  status: string;
  created_at: string;
}

export const getIncidentMarkers = async (): Promise<IncidentMarker[]> => {
  try {
    // 1. เรียกไปที่ Endpoint ใหม่ของ Backend
    // (สมมติว่า base URL ของ api คือ http://localhost:3000 แล้ว)
    const response = await api.get("/api/reports/active-map");

    // 2. โครงสร้างที่ได้มาคือ { success: true, count: 10, data: [...] }
    // ดังนั้นเราต้องเข้าถึง response.data.data
    if (response.data && response.data.success) {
        console.log("✅ Fetched markers successfully:", response.data.count);
        return response.data.data;
    }
    
    return [];

  } catch (error: any) {
    console.error("❌ Error fetching markers:", error.response?.data || error.message);
    return []; // คืนค่า array ว่างถ้าดึงข้อมูลไม่สำเร็จ แผนที่จะได้ไม่พัง
  }
};