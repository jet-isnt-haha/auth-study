import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { LoginSchema, type FormData } from "@/schemas/authSchema";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  //初始化useForm钩子
  const {
    register, //注册表单字段
    handleSubmit, //处理表单提交
    formState: { errors }, //获取验证错误
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema), //使用zodResolver集成验证
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit((data) => {
          setIsSubmitting(true);
          console.log(data);
          setTimeout(() => {
            setIsSubmitting(false);
          }, 3000);
        })}
      >
        <div>
          <label htmlFor="username">username</label>
          <input
            type="text"
            id="username"
            {...register("username")}
            disabled={isSubmitting}
          />
          {errors.username && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {errors.username.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          submit
        </button>
      </form>
      {/* registry navigation */}
      <p>
        <Link to="/registry" style={{ color: "blue", fontSize: "14px" }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
