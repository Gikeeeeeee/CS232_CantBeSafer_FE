import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/auth';
import { setCookie, deleteCookie } from 'cookies-next'; 

interface AuthAction {
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthAction>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // ปรับปรุง Login: ให้เก็บทั้งใน Store และ Cookie
      login: (user, token) => {
        // 1. เก็บใน Cookie เพื่อให้ Middleware อ่านได้ (ฝั่ง Server)
        setCookie('auth-token', token, { maxAge: 60 * 60 * 24, path: '/' });
        setCookie('user-role', user.role, { maxAge: 60 * 60 * 24, path: '/' });

        // 2. เก็บใน Zustand Store (ฝั่ง Client)
        set({ user, token, isAuthenticated: true });
      },

      // ปรับปรุง Logout: ล้างทั้งสองที่
      logout: () => {
        deleteCookie('auth-token');
        deleteCookie('user-role');
        set({ user: null, token: null, isAuthenticated: false });
        
        // ล้างค่าทั้งหมดใน LocalStorage ที่ Zustand เก็บไว้ด้วย (Optional)
        localStorage.removeItem('auth-storage');
      },
    }),
    { 
      name: 'auth-storage',
      // เลือกเก็บเฉพาะข้อมูลที่จำเป็นใน LocalStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);