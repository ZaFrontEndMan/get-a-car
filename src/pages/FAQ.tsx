import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useFAQ } from "@/hooks/useAdminSettings";
import { Skeleton } from "../components/ui/skeleton";
import { ChevronDown, Search } from "lucide-react";
import { debounce } from "lodash";

interface FAQItem {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  isOpen?: boolean;
}

const FAQ: React.FC = () => {
  const { t, language: lang } = useLanguage();
  const { data: faqs, isLoading, error } = useFAQ();
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSetSearchTerm(value);
    },
    [debouncedSetSearchTerm]
  );

  const filteredFAQs: FAQItem[] = useMemo(() => {
    if (isLoading || !Array.isArray(faqs)) return [];
    return faqs
      .filter((faq) => faq?.isActive)
      .filter((faq) => {
        const search = debouncedSearchTerm.toLowerCase();
        const title = (lang === "ar" ? faq?.titleAr : faq?.titleEn) || "";
        const desc =
          (lang === "ar" ? faq?.descriptionAr : faq?.descriptionEn) || "";
        return (
          title.toLowerCase().includes(search) ||
          desc.toLowerCase().includes(search)
        );
      })
      .map((faq) => ({
        ...faq,
        isOpen: openItems.has(faq?.id),
      }));
  }, [faqs, debouncedSearchTerm, openItems, isLoading, lang]);

  const toggleFAQ = useCallback((id: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    debouncedSetSearchTerm.cancel();
  }, [debouncedSetSearchTerm]);

  const renderLoadingFAQs = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <div className="pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-16 h-16 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {debouncedSearchTerm ? t("noResultsFound") : t("noFAQsAvailable")}
      </h3>
      <p className="text-gray-600 mb-6">
        {debouncedSearchTerm && t("tryDifferentSearch")}
      </p>
      {debouncedSearchTerm && (
        <button
          onClick={clearSearch}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          {t("clearSearch")}
        </button>
      )}
    </div>
  );

  const renderFAQItems = () => {
    if (isLoading) return renderLoadingFAQs();
    if (!filteredFAQs || filteredFAQs.length === 0) return renderEmptyState();
    return (
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <div
            key={faq?.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(faq?.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              aria-expanded={faq?.isOpen}
              aria-controls={`faq-content-${faq?.id}`}
            >
              <h3 className="text-lg font-semibold text-gray-900 pe-2 flex-1 text-start">
                {lang === "ar" ? faq.titleAr : faq.titleEn}
              </h3>
              <div
                className={`transform transition-transform duration-200 ${
                  faq?.isOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            {faq?.isOpen && (
              <div
                id={`faq-content-${faq?.id}`}
                className="px-6 pb-6 bg-gray-50"
                role="region"
                aria-labelledby={`faq-title-${faq?.id}`}
              >
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">
                    {lang === "ar" ? faq.descriptionAr : faq.descriptionEn}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
      <div className="text-red-500 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        {t("errorLoadingFAQs")}
      </h3>
      <p className="text-red-700 mb-4">{t("pleaseTryAgain")}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        {t("retry")}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("faq")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("faqDescription")}
            </p>
          </div>
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("searchFAQs")}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full ps-10 pe-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={t("clearSearch")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {debouncedSearchTerm && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {filteredFAQs.length} {t("resultsFound")}
              </p>
            )}
          </div>
          {!isLoading && !debouncedSearchTerm && filteredFAQs.length > 0 && (
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500">
                {filteredFAQs.length} {t("totalFAQs")}
              </p>
            </div>
          )}
          <div className="space-y-4 min-h-[400px]">
            {error && !isLoading ? renderErrorState() : renderFAQItems()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
