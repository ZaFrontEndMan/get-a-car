import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth/authApi";
import { useUserData } from "@/hooks/useUserData";
import { useUser } from "@/contexts/UserContext";

const loginSchema = z.object({
  username: z.string().email("Invalid username address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const SignIn = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { handleLoginResponse } = useUserData();
  const { getDefaultRoute } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
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

      // Use hardcoded user data instead of API response
      const mockUserData = {
        id: "787ca46b-0d02-4cf1-9266-021983964f19",
        roles: "Client",
        userName: "abdokader184@gmail.com",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3ODdjYTQ2Yi0wZDAyLTRjZjEtOTI2Ni0wMjE5ODM5NjRmMTkiLCJqdGkiOiI4YWNlM2ExOC0wMzljLTQyZmQtOGUyNC0yNWQzYTBmZGVjMTciLCJ1bmlxdWVfbmFtZSI6ImFiZG9rYWRlcjE4NEBnbWFpbC5jb20iLCJyb2xlIjoiQ2xpZW50IiwiVXNlclR5cGUiOiJDbGllbnQiLCJQZXJtaXNzaW9uIjoiQ2xpZW50OkNyZWF0ZSIsIm5iZiI6MTc1NzgwNjU4MywiZXhwIjoxNzU4NDExMzgzLCJpYXQiOjE3NTc4MDY1ODMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzA5OCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJ9.uaPRp2NGo4ueLqREMgA8pJuutUp5mDLE8nx3xH5zMQQ",
        isConfirmed: true,
      };

      // Always use mock data regardless of API response
      const userData = handleLoginResponse({
        ...res.data,
        userData: mockUserData,
      });

      if (userData) {
        toast.success("Login successful");
        const defaultRoute = getDefaultRoute();
        navigate(defaultRoute);
      } else {
        toast.error("Failed to process login data");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.customMessage);
    }
  };

  const handleQuickLogin = (role: "client" | "vendor" | "admin") => {
    const credentials = {
      client: {
        username: "abdokader184@gmail.com",
        password: "LEESQgMOD4p23/7tUFsGHQ==",
      },
      vendor: {
        username: "mahmoud7@gmail.com",
        password: "LEESQgMOD4p23/7tUFsGHQ==",
      },
      admin: {
        username: "mahmoud@gmail.com",
        password: "LEESQgMOD4p23/7tUFsGHQ==",
      },
    };

    setValue("username", credentials[role].username);
    setValue("password", credentials[role].password);
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
      <div className="relative z-20 pt-20 px-4 min-h-screen flex items-center justify-center w-full">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-primary">
            {t("signIn")}
          </h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("email")}
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

            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("client")}
                className="flex-1 rounded-lg bg-secondary px-4 py-2 text-white font-medium shadow-md hover:bg-secondary/90"
              >
                {t("quickLoginClient")}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("vendor")}
                className="flex-1 rounded-lg bg-secondary px-4 py-2 text-white font-medium shadow-md hover:bg-secondary/90"
              >
                {t("quickLoginVendor")}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="flex-1 rounded-lg bg-secondary px-4 py-2 text-white font-medium shadow-md hover:bg-secondary/90"
              >
                {t("quickLoginAdmin")}
              </button>
            </div>
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
