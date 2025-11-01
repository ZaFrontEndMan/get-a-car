import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth/authApi";
import { useUserData } from "@/hooks/useUserData";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import SignInForm from "@/components/auth/SignInForm";
import { fadeIn } from "@/utils/animations";

interface LoginFormData {
  username: string;
  password: string;
}

const SignIn = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { handleLoginResponse } = useUserData();
  const { getDefaultRoute } = useUser();
  const isRTL = language === "ar";

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authApi.login({
        userName: data.username,
        password: data.password,
        isPhone: false,
      });

      const mockUserData = {
        id: "787ca46b-0d02-4cf1-9266-021983964f19",
        roles: "Client",
        userName: "abdokader184@gmail.com",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3ODdjYTQ2Yi0wZDAyLTRjZjEtOTI2Ni0wMjE5ODM5NjRmMTkiLCJqdGkiOiI4YWNlM2ExOC0wMzljLTQyZmQtOGUyNC0yNWQzYTBmZGVjMTciLCJ1bmlxdWVfbmFtZSI6ImFiZG9rYWRlcjE4NEBnbWFpbC5jb20iLCJyb2xlIjoiQ2xpZW50IiwiVXNlclR5cGUiOiJDbGllbnQiLCJQZXJtaXNzaW9uIjoiQ2xpZW50OkNyZWF0ZSIsIm5iZiI6MTc1NzgwNjU4MywiZXhwIjoxNzU4NDExMzgzLCJpYXQiOjE3NTc4MDY1ODMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzA5OCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJ9.uaPRp2NGo4ueLqREMgA8pJuutUp5mDLE8nx3xH5zMQQ",
        isConfirmed: true,
      };

      const userData = handleLoginResponse({
        ...res.data,
        userData: mockUserData,
      });

      if (userData) {
        toast.success(t("loginSuccessful"));
        const defaultRoute = getDefaultRoute();
        navigate(defaultRoute);
      } else {
        toast.error(t("loginFailed"));
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.customMessage || t("invalidCredentials")
      );
    }
  };

  const handleQuickLogin = (role: "client" | "vendor") => {
    const encryptedCredentials = {
      client: {
        username: "abdokader184@gmail.com",
        password: "LEESQgMOD4p23/7tUFsGHQ==",
      },
      vendor: {
        username: "mahmoud7@gmail.com",
        password: "LEESQgMOD4p23/7tUFsGHQ==",
      },
    };

    const creds = encryptedCredentials[role];

    // Simulate form submission with quick login credentials
    onSubmit({
      username: creds.username,
      password: creds.password,
    });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
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

      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/60 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-20 px-4 min-h-screen flex items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <SignInForm onSubmit={onSubmit} onQuickLogin={handleQuickLogin} />

          {/* Footer Text */}
          <motion.div
            className="text-center mt-6 text-white/80 text-xs"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.8 }}
          >
            <p>© 2025 GETCAR. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
