import { RegisterSchema, type RegisterFormData } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCodeStore, useAuthStore } from "@/stores";
import { useNavigate } from "react-router-dom";

const Registry = () => {
  const imgRef = useRef<HTMLImageElement>(null);

  const { sendEmailCode, isSending, countdown } = useCodeStore();

  const _register = useAuthStore((state) => state.register);

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  //初始化useForm钩子
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleSendCode = async () => {
    const email = getValues("email");
    if (!email) {
      alert("请输入邮箱");
      return;
    }
    try {
      await sendEmailCode(email);
      alert("验证码已发送");
    } catch (error) {
      console.error("Failed to send email code:", error);
      alert("发送验证码失败，请稍后重试");
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await _register(data);
      alert("注册成功！");
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Registry</h1>
      <form onSubmit={handleSubmit(handleRegister)}>
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
            type="password"
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
          <button type="button" onClick={handleSendCode} disabled={isSending}>
            sendEmailCode{countdown ? countdown + "秒后可重新发送" : ""}
          </button>
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
          <img
            src="/captcha"
            alt="验证码"
            ref={imgRef}
            onClick={() => {
              imgRef.current!.src = "/captcha?" + Date.now(); /* 避免缓存 */
            }}
            style={{ cursor: "pointer" }}
          />
          {errors.captcha && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {errors.captcha.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          submit
        </button>
      </form>
    </div>
  );
};

export default Registry;
