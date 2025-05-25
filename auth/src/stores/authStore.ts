import type { AuthState, AuthActions } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      roles: [],
      login: async () => {},
      logout: async () => {},
      refresh: async () => {},
      initialize: async () => {},
    }),
    {
      name: "auth-storage",
      //序列化为JSON然后保存在localStorage中
      storage: createJSONStorage(() => localStorage),
      //精细控制持久化字段
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        roles: state.roles,
      }),
    }
  )
);

export default useAuthStore;
