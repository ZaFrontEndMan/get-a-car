import { useState, useEffect } from "react";
import {
  editVendor,
  uploadCompanyLogo,
  getUserInfo,
} from "../../api/vendor/vendorAuth";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface VendorData {
  vendorId: string;
  userId: string;
  fullName: string;
  nickName: string | null;
  managerName: string;
  countryName: string;
  cityName: string;
  canMakeOffer: boolean;
  isVerified: boolean;
  conactPerson: string | null;
  location: string;
  blackList: boolean;
  email: string;
  phoneNumber: string;
  nationalId: string;
  companyLogo: string;
  businessLicense: string;
  taxType: string;
  insurance: string;
}

interface VendorAuthState {
  data: VendorData | null;
  loading: boolean;
  error: string | null;
}

export const useVendorAuth = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [state, setState] = useState<VendorAuthState>({
    data: null,
    loading: true,
    error: null,
  });
  const [editForm, setEditForm] = useState({
    nickName: "",
    fullName: "",
    address: "",
    email: "",
    phoneNumber: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await getUserInfo();
      if (response.isSuccess && response.data) {
        setState((prev) => ({ ...prev, data: response.data, loading: false }));
        setEditForm({
          nickName: response.data.nickName || "",
          fullName: response.data.fullName || "",
          address: response.data.location || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
        });
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error || t("fetchUserInfoError"),
          loading: false,
        }));
      }
    } catch (error: any) {
      console.log(error);

      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.error?.customMessage ||
        t("fetchUserInfoError");
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
    }
  };

  const handleEdit = async () => {
    const formData = new FormData();
    if (logoFile) formData.append("companyLogo", logoFile);

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await editVendor(editForm, formData);
      if (response.isSuccess) {
        toast({
          title: t("success"),
          description: t("profileUpdatedSuccess"),
        });
        fetchUserInfo(); // Refresh data after successful edit
      } else {
        toast({
          title: t("error"),
          description: response.error || t("updateProfileError"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.customMessage ||
        t("updateProfileError");
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await uploadCompanyLogo(
        new FormData().append("companyLogo", logoFile)
      );
      if (response.isSuccess && response.data?.logoUrl) {
        toast({
          title: t("success"),
          description: t("logoUploadSuccess"),
        });
        fetchUserInfo(); // Refresh data after upload
      } else {
        toast({
          title: t("error"),
          description: response.error || t("logoUploadError"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.customMessage ||
        t("logoUploadError");
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return {
    ...state,
    editForm,
    setEditForm,
    logoFile,
    setLogoFile,
    fetchUserInfo,
    handleEdit,
    handleUploadLogo,
  };
};
