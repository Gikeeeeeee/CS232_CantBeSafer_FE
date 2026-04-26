import { api } from "../lib/axios";

interface LoginPayload {
    username: string;
    password?: string;
}

export const loginService = {
  postLogin: async (data: any) => {
    // ดักจับค่าที่ส่งมา
    const username = data.username || "";
    const password = data.password || "";

    console.log("Service Received:", { username, password });

    // เงื่อนไข Mock
    let role = "user";
    if (username === "admin" && password === "1234") {
      role = "admin";
    } else if (password !== "1234") {
      // ถ้าพาสเวิร์ดไม่ใช่ 1234 ให้เตะออก (เพื่อความสมจริงนิดนึง)
      throw new Error("Invalid username or password (MOCKED)");
    }

    // สร้าง Token ปลอมที่มีโครงสร้าง JWT เป๊ะๆ (Header.Payload.Signature)
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      id: role === "admin" ? 1 : 2,
      username: username,
      role: role, // ฝัง role ลงไปในนี้!
      email: `${username}@dome.tu.ac.th`
    }));
    const mockToken = `${header}.${payload}.mockSignature`;

    return {
      data: {
        token: mockToken,
        user: { username, role },
        message: "Login successful (MOCKED)"
      },
      status: 200
    };
  }
};