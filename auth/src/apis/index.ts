import type { User } from "@/types/auth";
import { apiPost, type IApiResponse } from "@/utils";
interface SendEmailCodeRequest {
  email: string;
}
export const loginAPI = (data: { email: string; password: string }) =>
  apiPost<IApiResponse<{ accessToken: string; user: User }>>("/login", data);

export const emailCodeAPI = (data: SendEmailCodeRequest) =>
  apiPost<IApiResponse<SendEmailCodeRequest>>("/email-code", data);
