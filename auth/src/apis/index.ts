import type { UserInfo } from "@/types/auth";
import { apiPost } from "@/utils";

export const loginAPI = (data: { email: string; password: "string" }) =>
  apiPost<{ accessToken: string; user: UserInfo }>("/login", data);
