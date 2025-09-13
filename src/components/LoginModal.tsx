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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const { t } = useLanguage();
  const { handleLoginResponse } = useUserData();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authApi.login({
        username: formData.email,
        password: formData.password,
        isPhone: false,
      });

      if (res.data?.isSuccess) {
        const userData = handleLoginResponse(res.data);
        if (userData) {
          toast.success(res.data.customMessage || "Login successful");
          onSuccess();
          onClose();
        } else {
          toast.error("Failed to process login data");
        }
      } else {
        toast.error(res.data?.customMessage || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.customMessage || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("signIn")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("emailAddress")}
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t("enterYourEmail")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t("enterPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 gradient-primary text-white py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : t("signIn")}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button className="text-primary hover:text-primary/80 font-medium">
            {t("signUp")}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
