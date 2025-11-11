import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Skeleton } from "../components/ui/skeleton";
import { usePrivacyPolicies } from "@/hooks/useAdminSettings";

const Privacy = () => {
  const { t, language } = useLanguage();
  const { data: response = {}, isLoading, error } = usePrivacyPolicies();

  // Adapt to response structure: .data now contains your array
  const privacyPolicies = response ?? [];

  // Sort and filter active policies
  const activePolicies = privacyPolicies
    .filter((policy) => policy.isActive)
    .sort((a, b) => a.id - b.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("privacy")}
              </h1>
              <p className="text-lg text-gray-600">{t("privacyDescription")}</p>
            </div>
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-8">
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || activePolicies.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("privacy")}
              </h1>
              <p className="text-lg text-gray-600">{t("privacyDescription")}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-red-600">{t("errorLoadingPrivacy")}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render either Arabic or English fields
  return (
    <div className="min-h-screen bg-cream">
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("privacy")}
            </h1>
            <p className="text-lg text-gray-600">{t("privacyDescription")}</p>
          </div>

          <div className="space-y-8">
            {activePolicies.map((policy) => (
              <div
                key={policy.id}
                className="bg-white rounded-lg shadow-sm p-6 sm:p-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {language === "ar" ? policy.mainTitleAr : policy.mainTitleEn}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">
                    {language === "ar"
                      ? policy.mainDescriptionAr
                      : policy.mainDescriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
