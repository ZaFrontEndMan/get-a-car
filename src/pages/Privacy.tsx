import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Skeleton } from "../components/ui/skeleton";
import { usePrivacyPolicies } from "@/hooks/useAdminSettings";

const Privacy = () => {
  const { t, language } = useLanguage();
  const { data: privacyPolicies = [], isLoading, error } = usePrivacyPolicies();

  // Sort by id to maintain consistent order, then filter active policies
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
              <div className="bg-white rounded-lg shadow-sm p-8">
                <Skeleton className="h-6 w-1/2 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
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
                  {policy.mainTitle}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">
                    {policy.mainDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* {activePolicies.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                {`${t("version")} ${activePolicies[0].id} - ${t(
                  "lastUpdated"
                )}: ${new Date().toLocaleDateString(
                  language === "ar" ? "ar-SA" : "en-US"
                )}`}
              </p>
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
};

export default Privacy;
