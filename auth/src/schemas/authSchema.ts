//验证模式文件
import { z } from "zod";

//定义验证schema(检查运行时的数据类型)
export const LoginSchema = z.object({
  username: z
    .string()
    .nonempty("username is required")
    .min(3, "username must be at least 3 character"),
  password: z
    .string()
    .nonempty("password is required")
    .min(6, "password must be at least 6 character"),
});

export type FormData = z.infer<typeof LoginSchema>;
