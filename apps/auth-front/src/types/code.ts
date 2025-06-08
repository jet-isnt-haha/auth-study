export interface CodeState {
  isSending: boolean;
  countdown: number;
  error: string | null;
}

export interface CodeActions {
  sendEmailCode: (email: string) => Promise<void>;

  resetState: () => void;
}
