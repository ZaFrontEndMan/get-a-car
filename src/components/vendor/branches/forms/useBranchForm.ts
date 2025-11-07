import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  useUpdateVendorBranch,
  useCreateVendorBranch,
} from "@/hooks/vendor/useVendorBranch";

// Saudi phone regex
const saPhoneRegex = /^(?:\+?9665\d{8}|009665\d{8}|9665\d{8}|05\d{8}|5\d{8})$/;
// Email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// National ID regex: must be 10 digits and start with 1 or 2
const nationalIdRegex = /^[12]\d{9}$/;

interface BranchFormData {
  nickName: string;
  address: string;
  managerName: string;
  fullName: string;
  password: string; // Only required for creation
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

const validateEmail = (email: string, t: any): string | undefined => {
  if (!email) return t("emailRequired");
  if (!emailRegex.test(email)) {
    return t("invalidEmail");
  }
  return undefined;
};

const validatePhone = (phone: string, t: any): string | undefined => {
  if (!phone) return t("phoneRequired");
  if (!saPhoneRegex.test(phone.replace(/\s/g, ""))) {
    return t("invalidPhone");
  }
  return undefined;
};

const validateUserName = (
  userName: string,
  isPhone: boolean,
  t: any
): string | undefined => {
  if (!userName) return t("userNameRequired");
  if (isPhone) {
    if (!saPhoneRegex.test(userName.replace(/\s/g, ""))) {
      return t("invalidPhone");
    }
  } else {
    if (!emailRegex.test(userName)) {
      return t("invalidEmail");
    }
  }
  return undefined;
};

const validateNationalId = (nationalId: string, t: any): string | undefined => {
  if (!nationalId) return t("nationalIdRequired");
  if (!nationalIdRegex.test(nationalId)) {
    return t("nationalIdMustStart1or2");
  }
  return undefined;
};

const validateRequired = (
  value: string,
  fieldKey: string,
  t: any
): string | undefined => {
  if (!value || value.trim() === "") {
    return t(fieldKey + "Required") || t("fieldRequired");
  }
  return undefined;
};

const validatePassword = (password: string, t: any): string | undefined => {
  // Not required if editing
  if (!password) return t("passwordRequired");
  if (password.length < 6) {
    return t("passwordMinLength");
  }
  return undefined;
};

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
        userName: branch.userName || "",
        email: branch.email || "",
        phoneNumber: branch.phoneNumber || "",
        nationalId: branch.nationalId || "",
        city: branch.city || null,
        country: branch.country || null,
        canMakeOffer:
          branch.canMakeOffer === undefined ? true : branch.canMakeOffer,
        notes: branch.notes || "",
        isPhone: branch.isPhone === undefined ? false : branch.isPhone,
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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Real-time validation
    if (field === "password") {
      // Only validate if not editing (required for creation only)
      if (!isEditing) {
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(value, t),
        }));
      }
    } else if (field === "email" && !isEditing) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value, t),
      }));
    } else if (field === "phoneNumber" && !isEditing) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: validatePhone(value, t),
      }));
    } else if (field === "userName") {
      setErrors((prev) => ({
        ...prev,
        userName: validateUserName(
          value,
          field === "userName" ? value.isPhone : formData.isPhone,
          t
        ),
      }));
    } else if (field === "nationalId") {
      setErrors((prev) => ({
        ...prev,
        nationalId: validateNationalId(value, t),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let validationErrors: FormErrors = {};

    // Common validations
    validationErrors.nickName = validateRequired(
      formData.nickName,
      "nickName",
      t
    );
    validationErrors.address = validateRequired(formData.address, "address", t);
    validationErrors.managerName = validateRequired(
      formData.managerName,
      "managerName",
      t
    );
    validationErrors.fullName = validateRequired(
      formData.fullName,
      "fullName",
      t
    );

    // Only require password on creation
    if (!isEditing) {
      validationErrors.password = validatePassword(formData.password, t);
    }
    if (!isEditing) {
      // Always validate userName, nationalId on submit
      validationErrors.userName = validateUserName(
        formData.userName,
        formData.isPhone,
        t
      );
      validationErrors.nationalId = validateNationalId(formData.nationalId, t);
    }

    if (!isEditing) {
      // Creation-only validation
      validationErrors.email = validateEmail(formData.email, t);
      validationErrors.phoneNumber = validatePhone(formData.phoneNumber, t);

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

    // Filter undefined errors
    const filteredErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(
        ([_, value]) => value !== undefined
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
