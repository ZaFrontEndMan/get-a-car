import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Navbar from "../Navbar";
import Footer from "../Footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
