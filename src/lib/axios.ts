import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true, // สำคัญสำหรับ cookie
  headers: {
    "Content-Type": "application/json",
  },
});