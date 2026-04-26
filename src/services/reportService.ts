import { getCookie } from 'cookies-next';
import { api } from "../lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

interface ReportData {
  title: string;
  description: string;
  urgency: number;
  latitude: number;
  longitude: number;
  locationName?: string;
  radius?: number;
}

export interface IncidentMarker {
  id: number;
  title: string;
  description: string;
  latitude: number | string; // เผื่อกรณี DB ส่งมาเป็น string
  longitude: number | string;
  urgency_score: number;
  image_url: string;
  status: string;
  created_at: string;
}

const getAuthHeader = (token?: string) => {
  const activeToken = token || getCookie('auth-token') as string;
  if (!activeToken) return "";
  return activeToken.startsWith("Bearer ") ? activeToken : `Bearer ${activeToken}`;
};

export const submitReport = async (data: ReportData, token?: string) => {
  if (USE_MOCK) return { report_id: 123 };

  try {
    const authHeader = getAuthHeader(token);

    // 🎯 ใช้ Key ตามโครงสร้าง JSON ที่คุณส่งมาให้เป๊ะๆ
    const payload = {
      report_title: data.title,
      report_description: data.description,
      urgency_score: Number(data.urgency),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      location: {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude)
      },
      location_name: data.locationName || "Unknown Location",
      radius: Number(data.radius) || 500
    };

    const res = await fetch(`${API_URL}/api/reports/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(payload),
    });

    const rawText = await res.text();
    let responseData: any;
    try {
      responseData = JSON.parse(rawText);
    } catch (e) {
      responseData = null;
    }

    if (!res.ok) {
      // 🎯 วิธีแก้: ถ้า Backend ด่าเรื่อง latitude มันจะอยู่ใน rawText
      // เราจะไม่พยายามอ่าน responseData.error.latitude อีกต่อไป
      // แต่จะพ่น rawText ออกมาให้เห็นเลยว่าพังเพราะอะไร
      console.error("❌ Backend Raw Error:", rawText);

      let errorMessage = `Error ${res.status}: `;
      if (responseData && typeof responseData === 'object') {
        // ถ้าเป็น object ให้แปลงเป็น string ทั้งก้อน จะได้ไม่ระเบิดเวลาอ่าน property
        errorMessage += responseData.message || responseData.error || JSON.stringify(responseData);
      } else {
        errorMessage += rawText || "Internal Server Error";
      }

      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error: any) {
    // ป้องกันกรณี error.message เป็น undefined
    throw new Error(error?.message || "Unknown Connection Error");
  }
};

export const uploadReportEvidence = async (
  reportId: number,
  file: File,
  token: string,
  lat?: number,  // 👈 เพิ่มตรงนี้
  lng?: number   // 👈 เพิ่มตรงนี้
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("report_id", String(reportId));

  // 🎯 ต้อง append ลง FormData ด้วย Backend ถึงจะเห็น req.body.latitude
  if (lat !== undefined) formData.append("latitude", String(lat));
  if (lng !== undefined) formData.append("longitude", String(lng));

  const res = await fetch(`${API_URL}/api/reports/postevidence`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Upload evidence failed");
  }
  return await res.json();
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