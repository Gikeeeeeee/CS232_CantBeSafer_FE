import axios from 'axios';
import { getCookie } from 'cookies-next';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// ส่ง Token ติดไปด้วยทุกครั้งที่ยิง API
api.interceptors.request.use((config) => {
  const token = getCookie('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ดักจับถ้า Token หมดอายุ (401) ให้ดีดไปหน้า Login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(err);
  }
);

// บรรทัดนี้แหละที่ loginService.tsx ของเพื่อนตามหา!
export default api;