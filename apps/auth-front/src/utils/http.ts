import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores";
import { errorHandler } from "./error";
import { ErrorType } from "@/types/error";

//创建Axios实例
const http: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

//请求拦截器

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    //需要跳过token校验的接口
    const skipAuthUrls = [
      "/login",
      "/register",
      "/refresh-token",
      "/email-code",
    ];
    if (skipAuthUrls.some((url) => config.url?.includes(url))) {
      return config;
    }

    //校验accesstoken
    const accessToken = useAuthStore.getState().token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }

    //若无accessToken，则在后端校验refreshToken
    try {
      //调用store里的refresh(其会请求/refresh-token,浏览器自动带cookie)
      await useAuthStore.getState().refresh();
      const newAccessToken = useAuthStore.getState().token;
      if (!newAccessToken) return errorHandler.handlerAuthError();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return config;
    } catch (error) {
      console.error("refresh token error:", error);
      return errorHandler.handlerAuthError();
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器

http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data } = response.data;

    if (code === 0) {
      return data;
    } else {
      // 业务错误，例如后端返回 code != 0 但 HTTP 状态码仍是 200
      // 此时可以根据后端返回的 code 和 msg 进行处理
      // 我们可以选择抛出错误，让后续的 catch 捕获并统一处理
      // 这里我们直接调用 errorHandler.handleError 来处理业务逻辑错误
      return errorHandler.handleError({
        type: ErrorType.BUSINESS, // 或者定义一个更具体的 ErrorType
        message: response.data.msg || "业务处理失败",
        options: { showNotification: true }, // 默认显示通知
      });
    }
  },
  (error) => {
    //统一处理HTTP错误
    return errorHandler.handlerHttpError(error);
  }
);

//封装请求方法

export const apiGet = <T>(url: string, params?: any): Promise<T> => {
  return http.get(url, { params });
};

export const apiPost = <T>(url: string, data?: any): Promise<T> => {
  return http.post(url, data);
};

export default http;
