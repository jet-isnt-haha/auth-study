//定义API响应类型
export interface IApiResponse<T = any> {
  data: T | null;
  code: number;
  msg: string;
}
