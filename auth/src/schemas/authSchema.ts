//验证模式文件
import { z } from "zod";
import { email } from "zod/v4";

//定义验证schema(检查运行时的数据类型)
export const LoginSchema = z.object({
  email: z
    .string()
    .nonempty("email is required")
    .email("email format is invalid"),
  password: z
    .string()
    .nonempty("password is required")
    .min(6, "password must be at least 6 character"),
});

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .nonempty("email is required")
      .email("email format is invalid"),
    password: z
      .string()
      .nonempty("password is required")
      .min(6, "password must be at least 6 character")
      .max(20, "password must be at less than 20 character"),
    confirmPassword: z.string(),
    emailCode: z.string().length(6, "emailCode's length is 6"),
    captcha: z.string().length(4, "captcha must be 4 character"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
