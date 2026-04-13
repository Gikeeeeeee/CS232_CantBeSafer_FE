import { api } from "../lib/axios";

export interface IncidentMarker {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  urgency_score: number;
  image_url: string;
  status: string;
  created_at: string;
}

export const getIncidentMarkers = async (): Promise<IncidentMarker[]> => {
  // --- ส่วนที่ 1: Mock Data (ข้อมูลจำลอง) ---
  // ถ้านายอยากเพิ่มหมุด ให้ก๊อปปี้ก้อน {} นี้ไปวางเพิ่มแล้วแก้พิกัดเอาครับ
  const mockData: IncidentMarker[] = [
    {
      id: 1,
      title: "อุบัติเหตุรถชน",
      description: "มีรถชนกันหน้าประตูเชียงราก 1",
      latitude: 14.0738, 
      longitude: 100.6062,
      urgency_score: 5,
      image_url: "https://via.placeholder.com/150",
      status: "EMERGENCY",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "น้ำท่วมขัง",
      description: "ทางเดินเท้าหน้าหอพักมีน้ำท่วม",
      latitude: 14.0755,
      longitude: 100.6080,
      urgency_score: 2,
      image_url: "https://via.placeholder.com/150",
      status: "NORMAL",
      created_at: new Date().toISOString()
    }
  ];

  try {
    // --- ส่วนที่ 2: ปิดการดึงข้อมูลจริงไว้ก่อน ---
    /*
    const response = await api.get("/api/reports/all");
    return response.data.data || [];
    */

    // คืนค่าข้อมูลจำลองออกไปแทน
    console.log("⚠️ Using Mock Data because Backend is broken");
    return mockData;

  } catch (error: any) {
    console.error("❌ Error fetching markers:", error.message);
    return mockData; // ถ้าพังก็ยังให้ส่ง Mock Data ออกไป
  }
};