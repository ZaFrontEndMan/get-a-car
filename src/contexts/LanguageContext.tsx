import React, { createContext, useContext, useState, useEffect } from "react";
import {
  translations,
  TranslationKey,
  SupportedLanguage,
} from "../translations";

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, any>) => string; // Updated to accept params
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

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    console.log("Saved language from localStorage:", savedLanguage);

    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      console.log("Setting language to:", language);
      localStorage.setItem("language", language);
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language, isInitialized]);

  const t = (key: string, params?: Record<string, any>): string => {
    const translationKey = key as TranslationKey;
    let translation = translations[language]?.[translationKey];

    if (!translation) {
      console.warn(
        `Missing translation for key: ${key} in language: ${language}`
      );
      return key;
    }

    // Replace placeholders with values from params
    if (params) {
      Object.keys(params).forEach((param) => {
        const placeholder = `{${param}}`;
        translation = translation.replace(placeholder, String(params[param]));
      });
    }

    return translation;
  };

  const handleSetLanguage = (lang: SupportedLanguage) => {
    console.log("Language change requested:", lang);
    setLanguage(lang);

    // Persist immediately and refresh to ensure UI consistency across the app
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("language", lang);
        // Refresh the page to apply language changes consistently
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    } catch (e) {
      console.warn("Failed to persist language before reload:", e);
    }
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
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
