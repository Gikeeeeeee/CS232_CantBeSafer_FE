import { api } from "../lib/axios";

interface LoginPayload {
    username: string;
    password?: string;
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function createMockJWT(id: number, username: string, role: string): string {
  const b64 = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const header = b64({ alg: "HS256", typ: "JWT" });
  const payload = b64({
    id,
    username,
    role,
    email: `${username}@dome.tu.ac.th`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  });
  return `${header}.${payload}.mocktoken`;
}

export const loginService = {
  postLogin: async (data: LoginPayload) => {
    if (USE_MOCK) {
      if (data.password !== '1234') {
        throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
      const isAdmin = data.username === 'admin';
      const token = createMockJWT(isAdmin ? 1 : 2, data.username, isAdmin ? 'admin' : 'user');
      return {
        data: {
          token,
          user: { username: data.username, role: isAdmin ? 'admin' : 'user' },
          message: "Mock Login successful",
        },
        status: 200,
      };
    }

    try {
      console.log("🚀 Calling Real Login API for:", data.username);
      const response = await api.post("/api/auth/login", data);
      const token = response.data.AccessToken || response.data.token;
      if (!token) throw new Error("No token received from server");
      return {
        data: {
          token,
          user: response.data.user || { username: data.username, role: response.data.role },
          message: "Login successful",
        },
        status: response.status,
      };
    } catch (error: any) {
      console.error("❌ Login Service Error:", error.response?.data || error.message);
      throw error;
    }
  },
};
