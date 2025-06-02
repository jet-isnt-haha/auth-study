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
    const { code, data } = response.data;

    if (code === 0) {
      return data;
    }
  },
  (error) => {
    //统一处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;
      console.log(status, data);
      switch (error.response.status) {
        case 400:
          alert(data.msg);
          break;
        case 401:
          //登录过期/未认证，强制登出并跳转
          return handleAuthFailure();
        case 403:
          //无权限
          alert("没有权限访问该资源");
          break;
        case 500:
          alert(data.msg || "服务器错误，请稍后重试");
          break;
        default:
          alert(data.msg || "未知错误");
      }
    } else {
      //网络错误或无响应
      alert("网络异常，请检查网络连接");
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
