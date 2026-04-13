import { api } from "../lib/axios";

// กำหนด Interface สำหรับข้อมูลที่จะส่งไปสมัครสมาชิก
interface SignupPayload {
  Username: string;     // เปลี่ยนเป็นตัวใหญ่
  Email: string;        // เปลี่ยนเป็นตัวใหญ่
  Password: string;     // เปลี่ยนเป็นตัวใหญ่
  Confirm_pass: string; // เพิ่มตัวนี้เข้ามา
}

export const signupService = async (data: SignupPayload) => {
  try {
    const response = await api.post("/auth/signup", data); // ปรับ URL ตาม API จริงของคุณ
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Signup failed";
  }
};