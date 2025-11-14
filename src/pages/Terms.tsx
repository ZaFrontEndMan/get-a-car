import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Skeleton } from "../components/ui/skeleton";
import { useTermsAndConditions } from "@/hooks/useAdminSettings";

const Terms = () => {
  const { t, language } = useLanguage();
  const { data: response = [], isLoading, error } = useTermsAndConditions();

  // 1. Extract the real terms array from the nested structure
  const termsConditions = response;
  console.log(response);

  // 2. Sort and filter as before
  const activeTerms = termsConditions
    .filter((terms) => terms.isActive)
    .sort((a, b) => a.id - b.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("terms")}
              </h1>
              <p className="text-lg text-gray-600">{t("termsDescription")}</p>
            </div>
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-8">
                  <Skeleton className="h-6 w-1/3 mb-4" />
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

  if (error || activeTerms.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("terms")}
              </h1>
              <p className="text-lg text-gray-600">{t("termsDescription")}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-red-600">{t("errorLoadingTerms")}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Show English or Arabic content based on selected language
  return (
    <div className="min-h-screen bg-cream">
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("terms")}
            </h1>
            <p className="text-lg text-gray-600">{t("termsDescription")}</p>
          </div>

          <div className="space-y-8">
            {activeTerms.map((terms) => (
              <div
                key={terms.id}
                className="bg-white rounded-lg shadow-sm p-6 sm:p-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {language === "ar" ? terms.mainTitleAr : terms.mainTitleEn}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">
                    {language === "ar"
                      ? terms.mainDescriptionAr
                      : terms.mainDescriptionEn}
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

export default Terms;
