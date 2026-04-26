import { api } from "../lib/axios";

// กำหนด Interface สำหรับข้อมูลที่จะส่งไปสมัครสมาชิก
interface SignupPayload {
  Username: string;
  Email: string;
  Password: string;
  Confirm_pass: string;
}

export const signupService = async (data: SignupPayload) => {
  try {
    const response = await api.post("/auth/signup", data); // ปรับ URL ตาม API จริงของคุณ
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Signup failed";
  }
};