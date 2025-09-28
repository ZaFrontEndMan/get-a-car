import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateVendorBranch } from "@/hooks/vendor/useVendorBranch";

interface BranchFormData {
  nickName: string;
  address: string;
  managerName: string;
  fullName: string;
  password: string;
}

interface FormErrors {
  password?: string;
}

export const useBranchForm = (branch: any, onSuccess: () => void, t: any) => {
  const [formData, setFormData] = useState<BranchFormData>({
    nickName: "",
    address: "",
    managerName: "",
    fullName: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { toast } = useToast();
  const updateBranchMutation = useUpdateVendorBranch();

  useEffect(() => {
    if (branch) {
      setFormData({
        nickName: branch.nickName || "",
        address: branch.address || "",
        managerName: branch.managerName || "",
        fullName: branch.fullName || "",
        password: branch.password || "",
      });
    }
  }, [branch]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        id: branch?.id ?? undefined,
      };

      if (formData.nickName !== (branch?.nickName || ""))
        payload.nickName = formData.nickName;
      if (formData.address !== (branch?.address || ""))
        payload.address = formData.address;
      if (formData.managerName !== (branch?.managerName || ""))
        payload.managerName = formData.managerName;
      if (formData.fullName !== (branch?.fullName || ""))
        payload.fullName = formData.fullName;
      if (formData.password !== (branch?.password || ""))
        payload.password = formData.password;

      return updateBranchMutation.mutateAsync(payload);
    },
    onSuccess: () => {
      toast({
        title: t("update"),
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response.data.error.message ||
          `Failed to ${branch ? "update" : "save"} branch`,
        variant: "destructive",
      });
    },
  });

  const validatePassword = (password: string): string | undefined => {
    if (!password) return undefined;

    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    if (!/\d/.test(password)) {
      return "Password must contain at least one digit";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }

    return undefined;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "password") {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }));
      toast({
        title: "Validation Error",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    mutation.mutate();
  };

  return {
    formData,
    errors,
    mutation,
    handleChange,
    handleSubmit,
  };
};
