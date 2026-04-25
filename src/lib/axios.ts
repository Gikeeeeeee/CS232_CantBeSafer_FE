import axios from "axios";

<<<<<<< Updated upstream
const baseURL = process.env.NEXT_PUBLIC_API_URL;
=======
// ดึงค่าจาก .env ถ้าหาไม่เจอให้ใช้ localhost:3000 เป็นค่าเริ่มต้น
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
>>>>>>> Stashed changes

export const api = axios.create({
  baseURL,
  withCredentials: true, // สำคัญสำหรับ cookie / session
  headers: {
    "Content-Type": "application/json",
  },
});