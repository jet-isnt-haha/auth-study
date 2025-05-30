import { create } from "zustand";
import { emailCodeAPI } from "@/apis";
import type { CodeActions, CodeState } from "@/types/code";

const useCodeStore = create<CodeState & CodeActions>((set, get) => ({
  isSending: false,
  countdown: 0,
  error: null,

  resetState: () => {
    set({
      isSending: false,
      countdown: 0,
      error: null,
    });
  },
  sendEmailCode: async (email: string) => {
    try {
      set({ isSending: true, error: null });
      await emailCodeAPI({ email });
      //开始倒计时
      set({ countdown: 60 });
      const timer = setInterval(() => {
        set((state) => ({
          countdown: state.countdown > 0 ? state.countdown - 1 : 0,
        }));
        if (get().countdown === 0) {
          clearInterval(timer);
          set({ isSending: false });
        }
      }, 1000);
    } catch (error: any) {
      set({
        isSending: false,
        error: error.message || "failed to send emailcode",
      });
      throw error;
    }
  },
}));

export default useCodeStore;
