import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  withCredentials: true, // สำคัญสำหรับ cookie
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- ระบบกลาง: ถ้า Backend ตอบกลับมาว่า 401 ให้เตะไปหน้า Login ทันที ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth-token'); // ลบบัตรที่หมดอายุ
      window.location.href = '/auth/login'; // เด้งไป Login
    }
    return Promise.reject(error);
  }
);