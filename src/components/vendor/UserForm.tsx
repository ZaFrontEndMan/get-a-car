import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGetVendorBranches } from "@/hooks/vendor/useVendorBranch";
import {
  useUpdateEmployee,
  useCreateEmployee,
} from "@/hooks/vendor/useVendorEmployee";
import { useQueryClient } from "@tanstack/react-query";
import { encryptPassword } from "@/utils/encryptPassword";
import { Switch } from "../ui/switch";

const genderOptions = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

interface UserFormProps {
  user?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormData = {
  password: "",
  userName: "",
  isPhone: false,
  email: "",
  fullName: "",
  nationalId: "",
  phoneNumber: "",
  gender: "1",
};

const UserForm = ({ user, onClose, onSuccess }: UserFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const { data: branchesData, isLoading: isBranchesLoading } =
    useGetVendorBranches();
  const vendorBranches = branchesData?.data?.vendorBranches || [];

  useEffect(() => {
    if (user) {
      setFormData({
        password: "",
        userName: user.userName || "",
        isPhone: user.isPhone || false,
        email: user.email || "",
        fullName: user.fullName || "",
        nationalId: user.nationalId || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender ? String(user.gender) : "1",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [user]);

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "email" && !prev.isPhone) {
        updated.userName = value;
      } else if (field === "phoneNumber" && prev.isPhone) {
        updated.userName = value;
      } else if (field === "isPhone") {
        if (value && prev.phoneNumber) {
          updated.userName = prev.phoneNumber;
        } else if (!value && prev.email) {
          updated.userName = prev.email;
        }
      }

      return updated;
    });
  };

  const handleBranchChange = (branchId: string) => {
    const selectedBranch = vendorBranches.find(
      (branch: any) => branch.id === branchId
    );
    setFormData((prev) => ({
      ...prev,
      branchId,
    }));
  };

  const isCreate = !user;
  const requiredFields = isCreate
    ? ["fullName", "phoneNumber", "email", "password", "nationalId"]
    : ["fullName", "phoneNumber", "email", "nationalId"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = requiredFields.filter((f) => !formData[f]);
    if (missing.length) {
      toast({
        title: t("error_title"),
        description: t("all_fields_required"),
        variant: "destructive",
      });
      return;
    }

    const payload = {
      userData: {
        userName: formData.userName,
        isPhone: !!formData.isPhone,
        ...(isCreate && { password: encryptPassword(formData.password) }),
      },
      userDetails: {
        email: formData.email,
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        phoneNumber: formData.phoneNumber,
        gender: parseInt(formData.gender),
      },
    };

    if (isCreate) {
      createMutation.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["vendor", "employees"] });
          toast({
            title: t("success_title"),
            description: t("user_created_success"),
          });
          onSuccess();
        },
        onError: (error: any) => {
          toast({
            title: t("error_title"),
            description:
              error?.response?.data?.error?.message || t("user_create_failed"),
            variant: "destructive",
          });
        },
      });
    } else {
      updateMutation.mutate(
        {
          employeeId: user.id,
          employeeData: { ...payload },
        },
        {
          onSuccess: () => {
            toast({
              title: t("success_title"),
              description: t("user_updated_success"),
            });
            onSuccess();
          },
          onError: (error: any) => {
            toast({
              title: t("error_title"),
              description: error?.message || t("user_update_failed"),
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const getUsernameDisplay = () => {
    if (formData.isPhone && formData.phoneNumber) return formData.phoneNumber;
    if (formData.email) return formData.email;
    return formData.userName;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isCreate ? t("add_user_title") : t("edit_user_title")}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">{t("full_name_label")}</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
                placeholder={t("fullNamePlaceholder")}
              />
            </div>

            {/* National ID */}
            <div>
              <Label htmlFor="nationalId">{t("national_id_label")}</Label>
              <Input
                id="nationalId"
                value={formData.nationalId}
                onChange={(e) => handleChange("nationalId", e.target.value)}
                required
                placeholder={t("nationalIdPlaceholder")}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">{t("email_label")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder={t("emailPlaceholder")}
                disabled={!isCreate}
              />
            </div>

            {/* Password - Create only */}
            {
              <div className="relative">
                <Label htmlFor="password">{t("password_label")}</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required={isCreate}
                  placeholder={t("passwordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-10 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            }

            {/* Hidden username field - auto-populated */}
            <input type="hidden" value={getUsernameDisplay()} readOnly />

            {/* Phone Number + isPhone Switch - aligned horizontally */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="phoneNumber">{t("phone_label")}</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  required
                  placeholder={t("phoneNumberPlaceholder")}
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  id="isPhone"
                  checked={!!formData.isPhone}
                  onCheckedChange={(checked) =>
                    handleChange("isPhone", checked)
                  }
                />
                <Label htmlFor="isPhone" className="mb-0">
                  {t("isPhoneLabel")}
                </Label>
              </div>
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender">{t("gender_label")}</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t(opt.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t("cancel_button")}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  isBranchesLoading
                }
              >
                {createMutation.isPending || updateMutation.isPending
                  ? t("saving_button")
                  : user
                  ? t("update_button")
                  : t("create_button")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
