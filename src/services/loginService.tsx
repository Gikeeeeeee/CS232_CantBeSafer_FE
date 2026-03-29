import api from "@/lib/axios";

interface LoginPayload {
    username: string;
    password?: string;
}

export const loginService = {
    postLogin: (data: LoginPayload) => {
        return api.post('/auth/login', data);
    }
}