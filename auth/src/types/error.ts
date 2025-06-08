export enum ErrorType {
  NETWORK = "NETWORK_ERROR",
  BUSINESS = "BUSINESS_ERROR",
  AUTH = "AUTH_ERROR",
  PERMISSION = "PERMISSION_ERROR",
  SERVER = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN_ERROR",
}

export interface ErrorHandlingOptions {
  showNotification?: boolean; //通知用户处理
  redirect?: string; //某些错误需要跳转到特定页面
  logError?: false; //某些预期的错误不需要记录日志
  customHandler?: (error: ErrorRespone) => void; //特殊错误需要特殊处理
}

export interface ErrorRespone {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: any;
  timestamp: number;
}
