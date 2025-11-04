import React, { createContext, useContext, useState, useEffect } from "react";
import {
  translations,
  TranslationKey,
  SupportedLanguage,
} from "../translations";

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, any>) => string;
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

  const loggedMissingKeys = new Set<string>();

  const t = (key: string, params?: Record<string, any>): string => {
    try {
      const translationKey = key as TranslationKey;
      let translation = translations[language]?.[translationKey];

      // If missing translation
      if (!translation) {
        const warningKey = `${language}:${key}`;
        if (!loggedMissingKeys.has(warningKey)) {
          console.warn(
            `[i18n] Missing translation for "${key}" in language "${language}".`
          );
          loggedMissingKeys.add(warningKey);
        }
        return key;
      }

      // Replace placeholders (e.g., "Hello {name}") safely
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

  const handleSetLanguage = (lang: SupportedLanguage) => {
    console.log("Language change requested:", lang);
    
    try {
      // Update state immediately for UI responsiveness
      setLanguage(lang);
      
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("language", lang);
      }
      
      // Instead of forcing a reload, let React handle the re-render
      // This prevents the blank page issue during navigation
      // The useEffect above will handle DOM attributes update
      
    } catch (e) {
      console.warn("Failed to change language:", e);
      // Fallback: if there's an error, maintain current language
    }
  };

  // Don't render children until language is initialized to prevent hydration mismatches
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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