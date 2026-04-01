import { api } from "../lib/axios";

// กำหนด Interface สำหรับข้อมูลที่จะส่งไปสมัครสมาชิก
interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export const signupService = async (data: SignupPayload) => {
  try {
    const response = await api.post("/auth/register", data); // ปรับ URL ตาม API จริงของคุณ
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Signup failed";
  }
};