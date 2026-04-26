import axios from "axios";

const baseURL = "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL,
  withCredentials: true, // สำคัญสำหรับ cookie
  headers: {
    "Content-Type": "application/json",
  },
});