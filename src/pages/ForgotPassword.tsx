import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Car,
  ArrowLeft,
  Mail,
  Lock,
  Check,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authApi } from "@/api/auth/authApi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ForgotPassword = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const step = searchParams.get("step") || "1";
  const emailFromParams = searchParams.get("email") || "";
  const tokenFromParams = searchParams.get("token") || "";

  const [email, setEmail] = useState(emailFromParams);
  const [isPhone, setIsPhone] = useState(false);
  const [isLoadingStep1, setIsLoadingStep1] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoadingStep2, setIsLoadingStep2] = useState(false);

  // Error and success states
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isRTL = language === "ar";

  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [emailFromParams]);

  // Auto-skip to step 2 if token exists in URL
  useEffect(() => {
    if (tokenFromParams && step === "1") {
      setTimeout(() => {
        setSearchParams({ step: "2", email: emailFromParams });
      }, 100);
    }
  }, [tokenFromParams, emailFromParams, step, setSearchParams]);

  // Clear messages when step changes
  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, [step]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingStep1(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await authApi.forgotPassword({
        isPhone,
        userName: email,
      });

      setSuccessMessage(t("resetLinkSent"));
      toast.success(t("passwordResetLinkSentMessage"));
      navigate("/");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setErrorMessage(
        error?.response?.data?.customMessage || t("errorSendingCode")
      );
    } finally {
      setIsLoadingStep1(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage(t("passwordsDoNotMatch"));
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(t("passwordTooShort"));
      return;
    }

    setIsLoadingStep2(true);

    try {
      await authApi.resetPassword({
        email: emailFromParams,
        newPassword,
        token: tokenFromParams, // Use token from URL instead of resetCode
      });

      setSuccessMessage(t("passwordResetSuccess"));

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setErrorMessage(
        error?.response?.data?.customMessage || t("errorResettingPassword")
      );
    } finally {
      setIsLoadingStep2(false);
    }
  };

  const handleBackToStep1 = () => {
    setSearchParams({ step: "1", email });
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: isRTL ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: isRTL ? 50 : -50,
      transition: { duration: 0.3 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, type: "spring" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="w-full md:max-w-md  bg-white rounded-2xl shadow-2xl overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header with gradient background */}
        <motion.div
          className="bg-gradient-to-r from-primary to-secondary text-white p-6 sm:p-8"
          variants={itemVariants}
        >
          <motion.h2
            className="text-xl sm:text-2xl font-bold text-center mb-2"
            key={`title-${step}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step === "1" ? t("forgotPassword") : t("resetPassword")}
          </motion.h2>
          <motion.p
            className="text-white/90 text-sm text-center"
            key={`subtitle-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {step === "1"
              ? t("enterEmailOrPhoneToGetCode")
              : t("enterNewPassword")}{" "}
            {/* Updated subtitle for step 2 */}
          </motion.p>
        </motion.div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Error/Success Messages */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                key="error"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red font-medium">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                key="success"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
              >
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-800 font-medium">
                    {successMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Indicator */}
          <motion.div
            className="flex items-center justify-center mb-6 sm:mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                  step === "1"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-green-500 text-white"
                }`}
                animate={{
                  scale: step === "1" ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {step === "1" ? (
                  "1"
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                )}
              </motion.div>

              <div className="w-12 sm:w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: step === "2" ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              <motion.div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                  step === "2"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
                animate={{
                  scale: step === "2" ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                2
              </motion.div>
            </div>
          </motion.div>

          {/* Step Forms */}
          <AnimatePresence mode="wait">
            {step === "1" && (
              <motion.form
                key="step1"
                onSubmit={handleRequestCode}
                className="space-y-4 sm:space-y-5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("emailOrPhone")}
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? "right-3" : "left-3"
                      } h-5 w-5 text-gray-400`}
                    />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full ${
                        isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                      } py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base`}
                      placeholder={t("enterEmailOrPhone")}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    id="isPhone"
                    checked={isPhone}
                    onChange={(e) => setIsPhone(e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="isPhone"
                    className="text-sm text-gray-700 cursor-pointer select-none"
                  >
                    {t("thisIsPhoneNumber")}
                  </label>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={isLoadingStep1}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-3.5 rounded-lg font-semibold text-base hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingStep1 ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        {t("sending")}
                      </span>
                    ) : (
                      t("sendResetCode")
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            )}

            {step === "2" && (
              <motion.form
                key="step2"
                onSubmit={handleResetPassword}
                className="space-y-4 sm:space-y-5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4"
                  variants={itemVariants}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs sm:text-sm text-blue-800 flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {tokenFromParams
                        ? t("useLinkToReset") ||
                          "Use this link to reset your password"
                        : t("codeSentTo") || "Reset link sent to"}
                      : <strong className="break-all">{emailFromParams}</strong>
                    </span>
                  </p>
                </motion.div>

                {/* Token info (hidden but used for submission) */}
                {tokenFromParams && (
                  <input type="hidden" value={tokenFromParams} name="token" />
                )}

                {/* Removed OTP input field - now using token from URL */}

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("newPassword")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? "right-3" : "left-3"
                      } h-5 w-5 text-gray-400`}
                    />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full ${
                        isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                      } py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base`}
                      placeholder={t("enterNewPassword")}
                      minLength={6}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? "right-3" : "left-3"
                      } h-5 w-5 text-gray-400`}
                    />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full ${
                        isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                      } py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base`}
                      placeholder={t("confirmNewPassword")}
                      minLength={6}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={isLoadingStep2}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-3.5 rounded-lg font-semibold text-base hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingStep2 ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        {t("resetting")}
                      </span>
                    ) : (
                      t("resetPassword")
                    )}
                  </Button>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={handleBackToStep1}
                  className="w-full text-primary hover:text-primary/80 font-medium text-sm py-2"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("didNotReceiveCode")}{" "}
                  {/* This now means "did not receive email link" */}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div
            className="mt-6 pt-6 border-t border-gray-200 text-center"
            variants={itemVariants}
          >
            <Link
              to="/signin"
              className="inline-flex items-center justify-center text-primary hover:text-primary/80 font-medium text-sm"
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("backToSignIn")}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
