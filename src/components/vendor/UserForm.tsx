import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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
import { useUpdateEmployee } from "@/hooks/vendor/useVendorEmployee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/api/vendor/vendorEmployeeApi";

interface UserFormProps {
  user?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm = ({ user, onClose, onSuccess }: UserFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  console.log(user);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    role: "employee",
    branchId: "",
    branchName: "",
  });

  const { data: branchesData, isLoading: isBranchesLoading } =
    useGetVendorBranches();
  const vendorBranches = branchesData?.data?.vendorBranches || [];

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        role: user.role || "employee",
        branchId: user.branchId || "",
        branchName: user.branchName || "",
      });
    }
  }, [user]);

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => createEmployee(data),
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
        description: error.message || t("user_create_failed"),
        variant: "destructive",
      });
    },
  });

  const updateMutation = useUpdateEmployee();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.branchId
    ) {
      toast({
        title: t("error_title"),
        description: t("all_fields_required"),
        variant: "destructive",
      });
      return;
    }

    if (user) {
      updateMutation.mutate(
        {
          employeeId: user.id,
          employeeData: formData,
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
              description: error.message || t("user_update_failed"),
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createMutation.mutate(formData);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {user ? t("edit_user_title") : t("add_user_title")}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">{t("full_name_label")}</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
                placeholder={t("full_name_placeholder")}
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
                placeholder={t("email_placeholder")}
                disabled={!!user}
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">{t("phone_label")}</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                required
                placeholder={t("phone_placeholder")}
              />
            </div>

            <div>
              <Label htmlFor="role">{t("role_label")}</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select_role_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">{t("role_employee")}</SelectItem>
                  <SelectItem value="manager">{t("role_manager")}</SelectItem>
                  <SelectItem value="owner">{t("role_owner")}</SelectItem>
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
