import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { LoginSchema, type LoginFormData } from "@/schemas/authSchema";
import { useAuthStore } from "@/stores";

const Login = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore((state) => state.login);

  //初始化useForm钩子
  const {
    register, //注册表单字段
    handleSubmit, //处理表单提交
    formState: { errors }, //获取验证错误
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema), //使用zodResolver集成验证
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      //登录成功
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div>
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            {...register("email")}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {errors.email.message}
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
