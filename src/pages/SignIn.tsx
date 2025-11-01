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
import { encryptPassword } from "@/utils/encryptPassword";

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
      // Encrypt password before sending
      const encryptedPassword = encryptPassword(data.password);

      const res = await authApi.login({
        userName: data.username,
        password: encryptedPassword, // Send encrypted password
        isPhone: false,
      });

      const userData = handleLoginResponse(res.data);

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
    const credentials = {
      client: {
        username: "abdokader184@gmail.com",
        password: "P@$$w0rd", // Use plain password
      },
      vendor: {
        username: "mahmoud7@gmail.com",
        password: "P@$$w0rd", // Use plain password
      },
    };

    const creds = credentials[role];

    // Encryption happens in onSubmit
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
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/revving.mp4" type="video/mp4" />
      </video>

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/60 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className="relative z-20 px-4 min-h-screen flex items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <SignInForm onSubmit={onSubmit} onQuickLogin={handleQuickLogin} />

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
