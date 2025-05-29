import type { AuthState, AuthActions } from "@/types/auth";
import { create } from "zustand";
import { loginAPI } from "@/apis";

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  role: null,
  login: async (email, password) => {
    try {
      const res = await loginAPI({ email, password });
      set({
        user: res.data!.user,
        token: res.data!.accessToken,
        isAuthenticated: true,
        role: res.data!.user.role,
      });
    } catch (error: any) {
      set({
        error: error.message || "登录失败",
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
      });
      throw error;
    }
  },
  logout: async () => {},
  refresh: async () => {},
  initialize: async () => {},
}));

export default useAuthStore;
