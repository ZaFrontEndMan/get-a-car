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
  branchId: "",
  branchName: "",
};

const UserForm = ({ user, onClose, onSuccess }: UserFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialFormData);
  // For password eye icon
  const [showPassword, setShowPassword] = useState(false);

  const { data: branchesData, isLoading: isBranchesLoading } =
    useGetVendorBranches();
  const vendorBranches = branchesData?.data?.vendorBranches || [];

  useEffect(() => {
    if (user) {
      setFormData({
        password: "",
        userName: "",
        isPhone: user.isPhone || false,
        email: user.email || "",
        fullName: user.fullName || "",
        nationalId: user.nationalId || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender ? String(user.gender) : "1",
        branchId: user.branchId || "",
        branchName: user.branchName || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [user]);

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBranchChange = (branchId: string) => {
    const selectedBranch = vendorBranches.find(
      (branch: any) => branch.id === branchId
    );
    setFormData((prev) => ({
      ...prev,
      branchId,
      branchName: selectedBranch ? selectedBranch.branchName : "",
    }));
  };

  const isCreate = !user;
  const requiredFields = isCreate
    ? [
        "fullName",
        "phoneNumber",
        "email",
        "branchId",
        "password",
        "userName",
        "nationalId",
      ]
    : ["fullName", "phoneNumber", "email", "branchId", "nationalId"];

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

    if (isCreate) {
      // Encrypt password before sending to API
      const encryptedPassword = encryptPassword(formData.password);
      const body = {
        userData: {
          password: encryptedPassword,
          userName: formData.userName,
          isPhone: !!formData.isPhone,
        },
        userDetails: {
          email: formData.email,
          fullName: formData.fullName,
          nationalId: formData.nationalId,
          phoneNumber: formData.phoneNumber,
          gender: parseInt(formData.gender),
          branchId: formData.branchId,
          branchName: formData.branchName,
        },
      };
      createMutation.mutate(body, {
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
            description: error?.message || t("user_create_failed"),
            variant: "destructive",
          });
        },
      });
    } else {
      const employeeData = {
        email: formData.email,
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        phoneNumber: formData.phoneNumber,
        gender: parseInt(formData.gender),
        branchId: formData.branchId,
        branchName: formData.branchName,
      };
      updateMutation.mutate(
        {
          employeeId: user.id,
          employeeData,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
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
            {/* Create-only fields */}
            {isCreate && (
              <>
                <div>
                  <Label htmlFor="userName">{t("user_name_label")}</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    required
                    placeholder={t("userNamePlaceholder")}
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="password">{t("password_label")}</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
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
                <div className="flex  items-center gap-2">
                  <Label htmlFor="isPhone">{t("isPhoneLabel")}</Label>
                  <Switch
                    id="isPhone"
                    checked={!!formData.isPhone}
                    onCheckedChange={(chicked) => handleChange("isPhone", chicked)}
                  />{" "}
                </div>
              </>
            )}
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
            <div>
              <Label htmlFor="phoneNumber">{t("phone_label")}</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                required
                placeholder={t("phoneNumberPlaceholder")}
              />
            </div>
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

            <div>
              <Label htmlFor="branchId">{t("branch_label")}</Label>
              <Select
                value={formData.branchId}
                onValueChange={handleBranchChange}
                disabled={isBranchesLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isBranchesLoading
                        ? t("loading_branches")
                        : t("select_branch_placeholder")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {vendorBranches.map((branch: any) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.branchName}
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
