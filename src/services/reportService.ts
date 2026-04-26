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
  latitude: number | string;
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
    const response = await api.get("/api/reports/active-map");

    if (response.data && response.data.success) {
      console.log("✅ ข้อมูลจากหลังบ้าน:", response.data.count, "รายการ");
      return response.data.data; 
    }
    return [];
  } catch (error: any) {
    console.error("❌ Error fetching markers:", error.response?.status, error.message);
    return [];
  }
}