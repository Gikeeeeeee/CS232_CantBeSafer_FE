import api from "@/lib/axios";
import { AxiosError } from "axios";

// กำหนด Interface ให้ตรงกับ Body ที่ Backend ต้องการเป๊ะๆ
export interface SignupPayload {
  Username: string;
  Password: string;
  Confirm_pass: string;
  Email: string;
}

export const signupService = async (data: SignupPayload) => {
  try {
    const response = await api.post("/auth/signup", data); 
    return response.data;
  } catch (error) {
    // แก้ Unexpected any ด้วยการเช็ค AxiosError
    if (error instanceof AxiosError) {
      throw error.response?.data?.message || "Signup failed";
    }
    throw new Error("An unexpected error occurred");
  }
};