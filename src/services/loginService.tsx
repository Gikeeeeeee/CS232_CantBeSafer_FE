import api from "../lib/axios";

export interface LoginPayload {
    Username: string;
    Password?: string;
}

export const loginService = {
    postLogin: (data: LoginPayload) => {
        return api.post('/auth/login', data);
    }
}