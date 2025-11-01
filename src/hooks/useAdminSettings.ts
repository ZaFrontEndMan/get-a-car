// hooks/useAdminSettings.ts
import { useQuery } from "@tanstack/react-query";
import { ApiAboutUs, ApiContactUs, constantsApi } from "@/api/website/constantsApi";

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  aboutData?: ApiAboutUs | null;
  contactSubmissions?: ApiContactUs[];
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
        // Fetch About Us data from API
        let aboutData: ApiAboutUs | null = null;
        try {
          const aboutList = await constantsApi.getAllAboutUs();
          aboutData =
            aboutList?.find((item) => item.isActive) || aboutList?.[0] || null;
        } catch (err) {
          console.error("Failed to fetch about us data:", err);
        }

        // Fetch Contact submissions from API
        let contactSubmissions: ApiContactUs[] = [];
        let contactEmail = DEFAULT_SETTINGS.contactEmail;
        let supportPhone = DEFAULT_SETTINGS.supportPhone;

        try {
          const submissions = await constantsApi.getAllContactUs();
          // Get the most recent submissions (limit to 5)
          contactSubmissions = submissions?.slice(0, 5) || [];

          // Extract contact email and phone from first submission
          if (submissions && submissions.length > 0) {
            const firstSubmission = submissions[0];
            if (firstSubmission.email) {
              contactEmail = firstSubmission.email;
            }
            if (firstSubmission.phoneNumber) {
              supportPhone = firstSubmission.phoneNumber;
            }
          }
        } catch (err) {
          console.error("Failed to fetch contact submissions:", err);
        }

        // Merge settings with extracted contact data
        const mergedSettings: AdminSettings = {
          ...DEFAULT_SETTINGS,
          contactEmail,
          supportPhone,
          aboutData,
          contactSubmissions,
        };

        return mergedSettings;
      } catch (err) {
        console.error("Error fetching admin settings:", err);
        // Return default values with API data on error
        return {
          ...DEFAULT_SETTINGS,
          aboutData: null,
          contactSubmissions: [],
        };
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
