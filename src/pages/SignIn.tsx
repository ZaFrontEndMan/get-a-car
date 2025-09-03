import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { authApi } from "@/api/auth/authApi";
import { useUserData } from "@/hooks/useUserData";

const loginSchema = z.object({
  username: z.string().email("Invalid username address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const SignIn = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { refetchUserData } = useUserData();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "abdokader184@gmail.com",
      password: "LEESQgMOD4p23/7tUFsGHQ==",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authApi.login({
        ...(data as { username: string; password: string }),
        isPhone: false,
      });
      if (res.data?.isSuccess) {
        const { token, roles } = res.data.data;

        Cookies.set("auth_token", token, { expires: 7 });
        refetchUserData();
        toast.success(res.data.customMessage || "Login successful");

        if (roles === "Client") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(res.data?.customMessage || "Login failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.customMessage || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/revving.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay with 50% opacity */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-secondary/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-primary">
            {t("signIn")}
          </h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("username")}
              </label>
              <input
                type="text"
                {...register("username")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("password")}
              </label>
              <input
                type="password"
                {...register("password")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center rounded-lg bg-primary px-4 py-2 text-white font-medium shadow-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? t("loading") : t("login")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t("dontHaveAccount")}{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 font-medium"
              >
                {t("signUpHere")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
