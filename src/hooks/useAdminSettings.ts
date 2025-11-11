import { useQuery } from "@tanstack/react-query";
import {
  ApiAboutUs,
  ApiContactUs,
  ApiFAQ,
  ApiPrivacyPolicy,
  ApiTermsAndCondition,
  ApprovedFeedback,
  WebsiteStatistics,
  constantsApi,
  ApiBlog,
  ApiSocialMedia,
} from "@/api/website/constantsApi";

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  businessHours: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  aboutData?: ApiAboutUs | null;
  contactSubmissions?: ApiContactUs[];
  approvedFeedback?: ApprovedFeedback[];
  websiteStatistics?: WebsiteStatistics | null;
  // New properties for Privacy Policy and Terms & Conditions
  privacyPolicies?: ApiPrivacyPolicy[];
  termsAndConditions?: ApiTermsAndCondition[];
}

const DEFAULT_SETTINGS: AdminSettings = {
  siteName: "GetCar Rental",
  siteDescription: "Premium car rental service in Saudi Arabia",
  contactEmail: "info@getcar.sa",
  supportPhone: "+966 11 123 4567",
  address: "123 King Fahd Road, Riyadh, Saudi Arabia",
  city: "Riyadh",
  country: "Saudi Arabia",
  website: "https://getcar.sa",
  businessHours: "",
  facebookUrl: "https://facebook.com/getcar",
  twitterUrl: "https://twitter.com/getcar",
  instagramUrl: "https://instagram.com/getcar",
  linkedinUrl: "https://linkedin.com/company/getcar",
  youtubeUrl: "https://youtube.com/getcar",
};

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: async (): Promise<AdminSettings> => {
      try {
        const [
          aboutList,
          submissions,
          approvedFeedback,
          websiteStatistics,
          privacyPolicies,
          termsAndConditions,
        ] = await Promise.all([
          constantsApi.getAllAboutUs(),
          constantsApi.getAllContactUs(),
          constantsApi.getApprovedFeedback(),
          constantsApi.getWebsiteStatistics(),
          constantsApi.getAllPrivacyPolicies(),
          constantsApi.getAllTermsAndConditions(),
        ]);

        const aboutData =
          aboutList?.find((item) => item.isActive) || aboutList?.[0] || null;
        const contactSubmissions = submissions?.slice(0, 5) || [];

        let contactEmail = DEFAULT_SETTINGS.contactEmail;
        let supportPhone = DEFAULT_SETTINGS.supportPhone;
        let address = DEFAULT_SETTINGS.address;
        let website = DEFAULT_SETTINGS.website;
        let businessHours = DEFAULT_SETTINGS.businessHours;

        if (submissions && submissions.length > 0) {
          const firstSubmission = submissions[0];
          if (firstSubmission.email) {
            contactEmail = firstSubmission.email;
          }
          if (firstSubmission.phoneNumber) {
            supportPhone = firstSubmission.phoneNumber;
          }
          if (firstSubmission.address) {
            address = firstSubmission.address;
          }
          if (firstSubmission.website) {
            website = firstSubmission.website;
          }
          if (firstSubmission.businessHours) {
            businessHours = firstSubmission.businessHours;
          }
        }

        const mergedSettings: AdminSettings = {
          ...DEFAULT_SETTINGS,
          contactEmail,
          supportPhone,
          address,
          website,
          businessHours,
          aboutData,
          contactSubmissions,
          approvedFeedback: approvedFeedback || [],
          websiteStatistics,
          // Add the new data
          privacyPolicies: privacyPolicies || [],
          termsAndConditions: termsAndConditions || [],
        };

        return mergedSettings;
      } catch (err) {
        console.error("Error fetching admin settings:", err);
        return {
          ...DEFAULT_SETTINGS,
          aboutData: null,
          contactSubmissions: [],
          approvedFeedback: [],
          websiteStatistics: null,
          privacyPolicies: [],
          termsAndConditions: [],
        };
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
export const useBlogs = () => {
  return useQuery<ApiBlog[]>({
    queryKey: ["blogs"],
    queryFn: constantsApi.getAllBlogs,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlogDetail = (id?: number) => {
  return useQuery<ApiBlog | null>({
    queryKey: ["blog-detail", id],
    queryFn: () => (id ? constantsApi.getBlogById(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
export const useSocialMedias = () => {
  return useQuery<ApiSocialMedia[]>({
    queryKey: ["social-medias"],
    queryFn: constantsApi.getAllSocialMedias,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
// Separate hooks for individual use cases
export const usePrivacyPolicies = () => {
  return useQuery({
    queryKey: ["privacy-policies"],
    queryFn: () => constantsApi.getAllPrivacyPolicies(),
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
  });
};

export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: ["terms-and-conditions"],
    queryFn: () => constantsApi.getAllTermsAndConditions(),
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
  });
};
export const useFAQ = () => {
  return useQuery<ApiFAQ[]>({
    queryKey: ["faqs"],
    queryFn: () => constantsApi.getAllFAQs(),
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    retry: 1,
  });
};
