import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores";

//全局认证失败处理函数
function handleAuthFailure() {
  useAuthStore.getState().logout();
  window.location.href = "/login";
  return Promise.reject(new Error("登录已过期,请重新登录"));
}

//定义API响应类型
interface IApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

//创建Axios实例
const http: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

//请求拦截器

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
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
      if (!newAccessToken) return handleAuthFailure();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return config;
    } catch (error) {
      console.error("refresh token error:", error);
      return handleAuthFailure();
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器

http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data, message } = response.data;
    if (code !== 200) {
      return Promise.reject(new Error(message || "请求失败"));
    }
    return data;
  },
  (error) => {
    //统一处理HTTP错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
        //...
      }
    }
    return Promise.reject(error);
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
