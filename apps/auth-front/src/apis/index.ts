import type { LoginForm, RegisterForm, User } from "@/types/auth";
import { apiPost } from "@/utils";
import type { IApiResponse } from "@/types/http";

export const loginAPI = (data: LoginForm) =>
  apiPost<IApiResponse<{ accessToken: string; user: User }>>("/login", data);

export const emailCodeAPI = (data: { email: string }) =>
  apiPost<IApiResponse>("/email-code", data);

export const registerAPI = (data: RegisterForm) =>
  apiPost<IApiResponse>("/register", data);
