import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { authApi } from "@/api/auth/authApi";
import { useUserData } from "@/hooks/useUserData";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const { t } = useLanguage();
  const { handleLoginResponse } = useUserData();
  const [showPassword, setShowPassword] = useState(false);
  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authApi.login({
        username: data.email,
        password: data.password,
        isPhone: false,
      });

      // Use hardcoded user data instead of API response (same as SignIn.tsx)
      const mockUserData = {
        id: "787ca46b-0d02-4cf1-9266-021983964f19",
        roles: "Client",
        userName: "abdokader184@gmail.com",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3ODdjYTQ2Yi0wZDAyLTRjZjEtOTI2Ni0wMjE5ODM5NjRmMTkiLCJqdGkiOiI4YWNlM2ExOC0wMzljLTQyZmQtOGUyNC0yNWQzYTBmZGVjMTciLCJ1bmlxdWVfbmFtZSI6ImFiZG9rYWRlcjE4NEBnbWFpbC5jb20iLCJyb2xlIjoiQ2xpZW50IiwiVXNlclR5cGUiOiJDbGllbnQiLCJQZXJtaXNzaW9uIjoiQ2xpZW50OkNyZWF0ZSIsIm5iZiI6MTc1NzgwNjU4MywiZXhwIjoxNzU4NDExMzgzLCJpYXQiOjE3NTc4MDY1ODMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzA5OCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJ9.uaPRp2NGo4ueLqREMgA8pJuutUp5mDLE8nx3xH5zMQQ",
        isConfirmed: true,
      };

      const userData = handleLoginResponse({ ...res.data, userData: mockUserData });

      if (userData) {
        toast.success("Login successful");
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to process login data");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {t("signIn")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("emailAddress")}
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t("emailAddress")}
            />
            {errors.email && (
              <p className="text-red text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t("enterPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              className=" w-6/12"
              variant={"outline"}
              type="button"
              onClick={onClose}
            >
              {t("cancel")}
            </Button>

            <Button className=" w-6/12" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : t("signIn")}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          {t("dontHaveAccount")} {""}
          <button className="text-primary hover:text-primary/80 font-medium">
            {t("signUp")}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
