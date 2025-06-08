import { useAuthStore } from "@/stores";
import { ErrorType, type ErrorHandlingOptions } from "@/types/error";

//处理认证错误
const handlerAuthError = (msg?: string): Promise<never> => {
  const auth = useAuthStore.getState();
  auth.logout();

  alert(msg || "登录过期，请重新登录");
  window.location.href = "/login";

  return Promise.reject(new Error(msg));
};

//处理普通错误
const handleError = ({
  type,
  message: msg,
  options,
}: {
  type: ErrorType;
  message: string;
  options: ErrorHandlingOptions;
}) => {
  if (options.showNotification) {
    alert(msg);
  }
  if (options.redirect) {
    window.location.href = options.redirect;
  }

  return Promise.reject({ type, message: msg });
};

//处理HTTP错误
const handlerHttpError = (
  error: any,
  options: ErrorHandlingOptions = { showNotification: true }
) => {
  if (!error.response) {
    return handleError({
      type: ErrorType.NETWORK,
      message: "网络连接异常，请检查网络",
      options,
    });
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return handleError({
        type: ErrorType.BUSINESS,
        message: data.msg,
        options,
      });

    case 401:
      return handlerAuthError(data.msg);
    case 403:
      return handleError({
        type: ErrorType.PERMISSION,
        message: data.msg,
        options,
      });
    case 404:
      return handleError({
        type: ErrorType.BUSINESS,
        message: data.msg || "请求资源不存在",
        options,
      });
    case 500:
    case 502:
    case 503:
    case 504:
      return handleError({
        type: ErrorType.SERVER,
        message: data.msg,
        options,
      });
    default:
      return handleError({
        type: ErrorType.UNKNOWN,
        message: "未知错误",
        options,
      });
  }
};

export const errorHandler = {
  handleError,
  handlerHttpError,
  handlerAuthError,
};
