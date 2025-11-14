import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  fadeIn,
  scaleIn,
  slideInUp,
  staggerContainer,
  staggerItem,
} from "@/utils/animations";

const loginSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SignInFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void;
  onQuickLogin: (role: "client" | "vendor") => Promise<void> | void;
  isLoading?: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  onQuickLogin,
  isLoading = false,
}) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleQuickLoginClick = (role: "client" | "vendor") => {
    onQuickLogin?.(role);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={scaleIn}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header with Logo */}
      <motion.div
        variants={slideInUp}
        className="bg-gradient-to-r from-primary to-secondary p-8 flex flex-col items-center justify-center"
      >
        <motion.img
          src="/logo.png"
          alt="Logo"
          onClick={() => {
            navigate("/");
          }}
          className="h-16 w-auto mb-4 cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.h1
          className="text-3xl font-bold text-white text-center"
          variants={staggerItem}
        >
          {t("signIn")}
        </motion.h1>
      </motion.div>

      {/* Form Container */}
      <motion.div
        className="p-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <motion.div variants={staggerItem}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("email")}
            </label>
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                {...register("username")}
                className={cn(
                  "w-full rounded-lg border-2 px-4 py-3 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  errors.username
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                )}
              />
            </motion.div>
            {errors.username && (
              <motion.p
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>✕</span> {errors.username.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password Input */}
          <motion.div variants={staggerItem}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("password")}
            </label>
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                {...register("password")}
                className={cn(
                  "w-full rounded-lg border-2 px-4 py-3 pe-12 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                )}
              />
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                  e.currentTarget.blur();
                }}
                className={cn(
                  "absolute inset-y-0 end-0 flex items-center px-3 text-gray-500 hover:text-gray-700",
                  "focus:outline-none focus-visible:outline-none"
                )}
                tabIndex={-1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </motion.button>
            </motion.div>
            {errors.password && (
              <motion.p
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>✕</span> {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div
            className="flex items-center justify-between text-sm"
            variants={staggerItem}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-gray-700 font-medium">
                {t("rememberMe")}
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t("forgotPassword")}
            </Link>
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={cn(
              "w-full rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-3",
              "text-white font-semibold text-center shadow-md hover:shadow-lg",
              "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:from-primary/90 hover:to-secondary/90"
            )}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting || isLoading ? t("loading") : t("login")}
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div className="relative my-6" variants={staggerItem}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-600 font-medium">
              {t("quickLoginTitle")}
            </span>
          </div>
        </motion.div>

        {process.env.NODE_ENV === "development" && (
          <motion.div
            className="grid grid-cols-3 gap-3"
            variants={staggerContainer}
          >
            <motion.button
              type="button"
              onClick={() => handleQuickLoginClick("client")}
              className={cn(
                "rounded-lg px-3 py-2.5 text-xs font-semibold text-white",
                "bg-blue-500 hover:bg-blue-600 transition-colors shadow-md"
              )}
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("quickLoginClient")}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleQuickLoginClick("vendor")}
              className={cn(
                "rounded-lg px-3 py-2.5 text-xs font-semibold text-white",
                "bg-green-500 hover:bg-green-600 transition-colors shadow-md"
              )}
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("quickLoginVendor")}
            </motion.button>
            <motion.button
              type="button"
              onClick={() =>
                window.open("https://get-car-admin.vercel.app/", "_blank")
              }
              className={cn(
                "rounded-lg px-3 py-2.5 text-xs font-semibold text-white",
                "bg-purple-500 hover:bg-purple-600 transition-colors shadow-md"
              )}
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("quickLoginAdmin")}
            </motion.button>
          </motion.div>
        )}
        {/* Sign Up Link */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-200 text-center"
          variants={staggerItem}
        >
          <p className="text-sm text-gray-700">
            {t("dontHaveAccount")}{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              {t("signUpHere")}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SignInForm;
