import axios from "axios";

// แนะนำให้ใช้ตัวเลือกที่ยืดหยุ่นที่สุด คือดึงจาก .env ถ้าไม่มีค่อยใช้ localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL,
  withCredentials: true, // สำคัญสำหรับ cookie / session
  headers: {
    "Content-Type": "application/json",
  },
});

// แถม: เพิ่ม interceptor เผื่อไว้ดักจับ Error หรือแนบ Token ในอนาคต
api.interceptors.request.use((config) => {
  return config;
});

export default api;