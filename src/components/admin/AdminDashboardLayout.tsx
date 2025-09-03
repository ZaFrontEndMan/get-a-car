import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminDashboardLayout = ({
  children,
  activeTab,
  onTabChange,
}: AdminDashboardLayoutProps) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = language === "ar";

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      // Force navigation even if signOut fails
      // navigate('/signin');
    }
  };

  const handleSettings = () => {
    onTabChange("settings");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <AdminHeader
        user={user}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex pt-16">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        {/* Main content with enhanced professional design */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out min-h-[calc(100vh-64px)] ${
            isRTL ? "lg:mr-72" : "lg:ml-72"
          }`}
        >
          {/* Enhanced container with better spacing and visual hierarchy */}
          <div className="relative">
            {/* Background pattern for visual appeal */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />

            <div className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <div className="max-w-7xl mx-auto">
                {/* Professional content container with enhanced styling */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 min-h-[calc(100vh-200px)] overflow-hidden">
                  {/* Content wrapper with proper padding and typography */}
                  <div className="p-6 lg:p-8">
                    <div
                      className={`${
                        isRTL ? "text-right font-arabic" : "text-left"
                      } space-y-6`}
                    >
                      {/* Enhanced content area */}
                      <div className="prose prose-gray max-w-none">
                        {children}
                      </div>
                    </div>
                  </div>

                  {/* Subtle bottom border for visual completion */}
                  <div className="h-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20" />
                </div>
              </div>
            </div>

            {/* Floating elements for modern touch */}
            <div
              className={`fixed bottom-8 ${
                isRTL ? "left-8" : "right-8"
              } pointer-events-none`}
            >
              <div className="w-2 h-16 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full" />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay enhancement */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboardLayout;
