import type {
  AuthState,
  AuthActions,
  LoginForm,
  RegisterForm,
} from "@/types/auth";
import { create } from "zustand";
import { loginAPI, registerAPI } from "@/apis";

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  role: null,
  login: async (data: LoginForm) => {
    try {
      const res = await loginAPI(data);
      set({
        user: res.data!.user,
        token: res.data!.accessToken,
        isAuthenticated: true,
        role: res.data!.user.role,
      });
    } catch (error: any) {
      set({
        error: error.message || "failed to login",
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
  register: async (data: RegisterForm) => {
    try {
      const res = await registerAPI(data);

      console.log(res);
    } catch (error: any) {
      set({
        error: error.message || "failed to register",
      });
      throw error;
    }
  },
}));

export default useAuthStore;
