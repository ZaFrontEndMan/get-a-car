import { useQuery } from "@tanstack/react-query";
import {
  getVendorFAQs,
  getFaqById,
} from "../../api/vendor/vendorFaqApi";

// Query keys
const VENDOR_FAQ_QUERY_KEYS = {
  all: ["vendor", "faqs"] as const,
  lists: () => [...VENDOR_FAQ_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...VENDOR_FAQ_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...VENDOR_FAQ_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VENDOR_FAQ_QUERY_KEYS.details(), id] as const,
};

// Get vendor FAQs
export const useGetVendorFAQs = () => {
  return useQuery({
    queryKey: VENDOR_FAQ_QUERY_KEYS.lists(),
    queryFn: getVendorFAQs,
  });
};

// Get FAQ by ID
export const useGetFaqById = (faqId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: VENDOR_FAQ_QUERY_KEYS.detail(faqId),
    queryFn: () => getFaqById(faqId),
    enabled: enabled && !!faqId,
  });
};