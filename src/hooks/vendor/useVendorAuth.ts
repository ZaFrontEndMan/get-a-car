import { useState, useEffect } from "react";
import {
  editVendor,
  uploadCompanyLogo,
  getUserInfo,
  updateVendorDocuments,
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

  // Document files state
  const [documentFiles, setDocumentFiles] = useState<{
    businessLicense: File | null;
    taxType: File | null;
    insurance: File | null;
  }>({
    businessLicense: null,
    taxType: null,
    insurance: null,
  });

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

  // Updated handleEdit to accept documentFiles as parameter
  const handleEdit = async (docs?: {
    businessLicense: File | null;
    taxType: File | null;
    insurance: File | null;
  }) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      // Create FormData for files
      const formData = new FormData();

      // Add logo if changed
      if (logoFile) {
        formData.append("companyLogo", logoFile);
      }

      // Add documents ONLY if they have been changed (not null)
      if (docs?.businessLicense) {
        formData.append("businessLicense", docs.businessLicense);
      }
      if (docs?.taxType) {
        formData.append("taxType", docs.taxType);
      }
      if (docs?.insurance) {
        formData.append("insurance", docs.insurance);
      }

      // Edit vendor with basic info and files
      const editResponse = await editVendor(editForm, formData);

      if (!editResponse.isSuccess) {
        toast({
          title: t("error"),
          description: editResponse.error || t("updateProfileError"),
          variant: "destructive",
        });
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      // Success - show message and refresh data
      toast({
        title: t("success"),
        description: t("profileUpdatedSuccess"),
      });

      // Clear file states
      setLogoFile(null);
      setDocumentFiles({
        businessLicense: null,
        taxType: null,
        insurance: null,
      });

      // Refresh user data
      await fetchUserInfo();
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
      const formData = new FormData();
      formData.append("companyLogo", logoFile);

      const response = await uploadCompanyLogo(formData);
      if (response.isSuccess && response.data?.logoUrl) {
        toast({
          title: t("success"),
          description: t("logoUploadSuccess"),
        });
        setLogoFile(null);
        fetchUserInfo();
      } else {
        toast({
          title: t("error"),
          description: response.error || t("logoUploadError"),
          variant: "destructive",
        });
        setState((prev) => ({ ...prev, loading: false }));
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
    documentFiles,
    setDocumentFiles,
    fetchUserInfo,
    handleEdit,
    handleUploadLogo,
  };
};
