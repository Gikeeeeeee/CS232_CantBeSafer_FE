import { getCookie } from 'cookies-next';

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

const getAuthHeader = (token?: string) => {
  const activeToken = token || getCookie('auth-token') as string;
  if (!activeToken) return "";
  return activeToken.startsWith("Bearer ") ? activeToken : `Bearer ${activeToken}`;
};

export const submitReport = async (data: ReportData, token?: string) => {
  if (USE_MOCK) {
    return { report_id: Math.floor(Math.random() * 10000) + 1 };
  }

  try {
    const authHeader = getAuthHeader(token);
    const res = await fetch(`${API_URL}/api/reports/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      // แก้ไขตรง body ด้านล่างนี้ทั้งหมดครับ
      body: JSON.stringify({
        report_title: data.title,
        report_description: data.description,
        urgency_score: data.urgency,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        location_name: data.locationName || "Unknown Location", // ใส่ค่า fallback เผื่อไว้
        radius: data.radius || 10 // ใส่ค่าเริ่มต้นเผื่อไม่ได้ส่งมา
      }),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const uploadReportEvidence = async (reportId: number, file: File, token?: string) => {
  if (USE_MOCK) {
    return { success: true, message: "Mock upload successful" };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("report_id", String(reportId));

    const res = await fetch(`${API_URL}/api/reports/postevidence`, {
      method: "POST",
      headers: { "Authorization": getAuthHeader(token) },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch (error) {
    throw error;
  }
};
