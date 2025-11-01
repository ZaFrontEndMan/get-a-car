import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { authApi } from "@/api/auth/authApi";
import { useUserData } from "@/hooks/useUserData";
import SignInForm from "./auth/SignInForm";
import ClientSignUp from "./auth/ClientSignUp";
import { encryptPassword } from "@/utils/encryptPassword";

interface CheckUserBeforeBookingProps {
  onUserVerified?: () => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

const CheckUserBeforeBooking: React.FC<CheckUserBeforeBookingProps> = ({
  onUserVerified,
}) => {
  const { t, language } = useLanguage();
  const { handleLoginResponse } = useUserData();
  const isRTL = language === "ar";
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      const encryptedPassword = encryptPassword(data.password);

      const res = await authApi.login({
        userName: data.username,
        password: encryptedPassword,
        isPhone: false,
      });

      const userData = handleLoginResponse(res.data);

      if (userData) {
        toast.success(t("loginSuccessful"));
        onUserVerified?.();
      } else {
        toast.error(t("loginFailed"));
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.customMessage || t("invalidCredentials")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: "client" | "vendor") => {
    const credentials = {
      client: {
        username: "abdokader184@gmail.com",
        password: "P@$$w0rd",
      },
      vendor: {
        username: "mahmoud7@gmail.com",
        password: "P@$$w0rd",
      },
    };

    const creds = credentials[role];

    await handleSignInSubmit({
      username: creds.username,
      password: creds.password,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full"
    >
      <Card>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "signin" | "signup")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t("signIn")}</TabsTrigger>
              <TabsTrigger value="signup">{t("signUp")}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <SignInForm
                  onSubmit={handleSignInSubmit}
                  onQuickLogin={handleQuickLogin}
                  isLoading={isLoading}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ClientSignUp />
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CheckUserBeforeBooking;
