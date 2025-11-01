import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  useUpdateVendorBranch,
  useCreateVendorBranch,
} from "@/hooks/vendor/useVendorBranch";

interface BranchFormData {
  nickName: string;
  address: string;
  managerName: string;
  fullName: string;
  password: string;
  // Additional fields for creation
  userName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  city: number | null;
  country: number | null;
  canMakeOffer: boolean;
  notes: string;
  isPhone: boolean;
}

interface FormErrors {
  nickName?: string;
  address?: string;
  managerName?: string;
  fullName?: string;
  password?: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  nationalId?: string;
  city?: string;
  country?: string;
}

export const useBranchForm = (
  branch: any,
  onSuccess: () => void,
  t: any,
  isEditing: boolean = true
) => {
  const [formData, setFormData] = useState<BranchFormData>({
    nickName: "",
    address: "",
    managerName: "",
    fullName: "",
    password: "",
    userName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    city: null,
    country: null,
    canMakeOffer: true,
    notes: "",
    isPhone: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const updateBranchMutation = useUpdateVendorBranch();
  const createBranchMutation = useCreateVendorBranch();

  useEffect(() => {
    if (branch && isEditing) {
      setFormData({
        nickName: branch.nickName || "",
        address: branch.address || "",
        managerName: branch.managerName || "",
        fullName: branch.fullName || "",
        password: "",
        userName: "",
        email: "",
        phoneNumber: "",
        nationalId: "",
        city: null,
        country: null,
        canMakeOffer: true,
        notes: "",
        isPhone: false,
      });
    } else if (!isEditing) {
      setFormData({
        nickName: "",
        address: "",
        managerName: "",
        fullName: "",
        password: "",
        userName: "",
        email: "",
        phoneNumber: "",
        nationalId: "",
        city: null,
        country: null,
        canMakeOffer: true,
        notes: "",
        isPhone: false,
      });
    }
  }, [branch, isEditing]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEditing && branch?.id) {
        const payload: any = {
          id: branch.id,
        };

        if (formData.nickName !== (branch.nickName || ""))
          payload.nickName = formData.nickName;
        if (formData.address !== (branch.address || ""))
          payload.address = formData.address;
        if (formData.managerName !== (branch.managerName || ""))
          payload.managerName = formData.managerName;
        if (formData.fullName !== (branch.fullName || ""))
          payload.fullName = formData.fullName;
        if (formData.password && formData.password !== (branch.password || ""))
          payload.password = formData.password;

        return updateBranchMutation.mutateAsync(payload);
      } else {
        const createPayload = {
          userData: {
            password: formData.password,
            userName: formData.userName,
            isPhone: formData.isPhone,
          },
          userDetails: {
            address: formData.address,
            city: formData.city || 0,
            country: formData.country || 0,
            email: formData.email,
            fullName: formData.fullName,
            managerName: formData.managerName,
            nationalId: formData.nationalId,
            nickName: formData.nickName,
            phoneNumber: formData.phoneNumber,
            canMakeOffer: formData.canMakeOffer,
            notes: formData.notes || "",
          },
        };

        return createBranchMutation.mutateAsync(createPayload);
      }
    },
    onSuccess: () => {
      const action = isEditing ? t("update") : t("create");
      toast({
        title: action,
        description: isEditing ? t("branchUpdated") : t("branchCreated"),
      });
      onSuccess();
    },
    onError: (error: any) => {
      const action = isEditing ? "update" : "create";
      toast({
        title: "Error",
        description:
          error?.response?.data?.error?.message || `Failed to ${action} branch`,
        variant: "destructive",
      });
    },
  });

  // Simplified password validation - minimum 6 characters
  const validatePassword = (password: string): string | undefined => {
    if (!password) return t("passwordRequired");
    if (password.length < 6) {
      return t("passwordMinLength");
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return t("emailRequired");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t("invalidEmail");
    }
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return t("phoneRequired");
    const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return t("invalidPhone");
    }
    return undefined;
  };

  const validateRequired = (
    value: string,
    fieldKey: string
  ): string | undefined => {
    if (!value || value.trim() === "") {
      return t(fieldKey + "Required") || t("fieldRequired");
    }
    return undefined;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Real-time validation
    if (field === "password") {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    } else if (field === "email" && !isEditing) {
      const emailError = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: emailError }));
    } else if (field === "phoneNumber" && !isEditing) {
      const phoneError = validatePhone(value);
      setErrors((prev) => ({ ...prev, phoneNumber: phoneError }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let validationErrors: FormErrors = {};

    // Common validations for all modes
    validationErrors.nickName = validateRequired(formData.nickName, "nickName");
    validationErrors.address = validateRequired(formData.address, "address");
    validationErrors.managerName = validateRequired(
      formData.managerName,
      "managerName"
    );
    validationErrors.fullName = validateRequired(formData.fullName, "fullName");
    validationErrors.password = validatePassword(formData.password);

    if (!isEditing) {
      // Creation-only validation
      validationErrors.userName = validateRequired(
        formData.userName,
        "userName"
      );
      validationErrors.email = validateEmail(formData.email);
      validationErrors.phoneNumber = validatePhone(formData.phoneNumber);
      validationErrors.nationalId = validateRequired(
        formData.nationalId,
        "nationalId"
      );

      if (
        !formData.country ||
        formData.country === 0 ||
        formData.country === null
      ) {
        validationErrors.country = t("countryRequired");
      }
      if (!formData.city || formData.city === 0 || formData.city === null) {
        validationErrors.city = t("cityRequired");
      }
    }

    // Filter out undefined errors
    const filteredErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(
        ([, value]) => value !== undefined
      )
    ) as FormErrors;

    const hasErrors = Object.keys(filteredErrors).length > 0;

    if (hasErrors) {
      setErrors(filteredErrors);

      const firstError = Object.values(filteredErrors).find(
        (error) => error !== undefined
      );
      if (firstError) {
        toast({
          title: t("validationError"),
          description: firstError,
          variant: "destructive",
        });
      }
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
