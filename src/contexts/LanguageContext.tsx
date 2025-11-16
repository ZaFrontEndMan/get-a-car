import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  translations,
  TranslationKey,
  SupportedLanguage,
} from "../translations";

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, any>) => string;
  // Method to get accumulated missing keys (exposed but called internally)
  getMissingTranslations: () => Record<string, string[]>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  // Store missing keys: object language -> array of missing keys
  const missingTranslationsRef = useRef<Record<string, Set<string>>>({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage as SupportedLanguage);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("language", language);
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language, isInitialized]);

  const t = (key: string, params?: Record<string, any>): string => {
    try {
      const translationKey = key as TranslationKey;
      let translation = translations[language]?.[translationKey];

      if (!translation) {
        // Record missing key for this language in a Set to dedupe
        if (!missingTranslationsRef.current[language]) {
          missingTranslationsRef.current[language] = new Set<string>();
        }
        if (!missingTranslationsRef.current[language].has(key)) {
          missingTranslationsRef.current[language].add(key);
        }
        return key; // fallback to key string
      }

      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          const regex = new RegExp(`\\{${param}\\}`, "g");
          translation = translation.replace(regex, String(value));
        });
      }

      return translation;
    } catch (error) {
      console.error("Translation error:", error);
      return key;
    }
  };

  // Called internally to get and log missing translations
  const getMissingTranslations = (): Record<string, string[]> => {
    const result: Record<string, string[]> = {};
    for (const lang in missingTranslationsRef.current) {
      result[lang] = Array.from(missingTranslationsRef.current[lang]);
    }
    return result;
  };

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    window.location.reload();
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        getMissingTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
