import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { vendorPoliciesApi } from "@/api/vendor/vendorPoliciesApi";

interface VendorPolicy {
  id: string;
  title: string;
  description: string;
  policyType: number;
  displayOrder: number;
  isActive: boolean;
  vendorId: string;
  vendorBranchId: string | null;
}

interface ApiResponse {
  isSuccess: boolean;
  customMessage?: string;
  data: VendorPolicy[];
}

interface PolicyBody {
  titleEn: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr?: string;
  policyType: number;
  displayOrder: number;
  isActive: boolean;
}

export const useVendorPolicies = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch all policies
  const {
    data: policies = { data: [] },
    isLoading,
    error,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["vendorPolicies"],
    queryFn: () => vendorPoliciesApi.getAllPolicies(),
  });

  // Create policy mutation
  const createMutation = useMutation({
    mutationFn: (body: PolicyBody) => vendorPoliciesApi.createPolicy(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorPolicies"] });
      toast.success(t("success_policy_created"));
    },
    onError: (error) => {
      toast.error(t("errors_required_english_fields"));
      console.error("Create policy error:", error);
    },
  });

  // Update policy mutation
  const updateMutation = useMutation({
    mutationFn: ({ policyId, body }: { policyId: string; body: PolicyBody }) =>
      vendorPoliciesApi.updatePolicy(policyId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorPolicies"] });
      toast.success(t("success_policy_updated"));
    },
    onError: (error) => {
      toast.error(t("errors_required_english_fields"));
      console.error("Update policy error:", error);
    },
  });

  // Delete policy mutation
  const deleteMutation = useMutation({
    mutationFn: (policyId: string) => vendorPoliciesApi.deletePolicy(policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorPolicies"] });
      toast.success(t("success_policy_deleted"));
    },
    onError: (error) => {
      toast.error(t("errors_required_english_fields"));
      console.error("Delete policy error:", error);
    },
  });

  return {
    policies: policies.data || [],
    isLoading,
    error,
    createPolicy: createMutation.mutate,
    updatePolicy: updateMutation.mutate,
    deletePolicy: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
