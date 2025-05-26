import type { User } from "@/types/auth";
import { apiPost } from "@/utils";

export const loginAPI = (data: { email: string; password: string }) =>
  apiPost<{ accessToken: string; user: User }>("/login", data);
