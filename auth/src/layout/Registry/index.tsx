import { RegisterSchema, type RegisterFormData } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Registry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  //初始化useForm钩子
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  return (
    <div>
      <h1>Registry</h1>
      <form>
        {/* email */}
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

        {/* password */}
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

        {/* confirmPassword */}
        <div>
          <label htmlFor="confirmPassword">confirmPassword</label>
          <input
            type="confirmPassword"
            id="confirmPassword"
            {...register("confirmPassword")}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* emailCode */}
        <div>
          <label htmlFor="emailCode">emailCode</label>
          <input
            type="text"
            id="emailCode"
            {...register("emailCode")}
            disabled={isSubmitting}
          />
          <button type="button">sendEmailCode</button>
          {errors.emailCode && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {errors.emailCode.message}
            </p>
          )}
        </div>

        {/* captcha */}
        <div>
          <label htmlFor="captcha">captcha</label>
          <input
            type="text"
            id="captcha"
            {...register("captcha")}
            disabled={isSubmitting}
          />
          <img src="" alt="" />
          {errors.captcha && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {errors.captcha.message}
            </p>
          )}
        </div>

        <button>submit</button>
      </form>
    </div>
  );
};

export default Registry;
