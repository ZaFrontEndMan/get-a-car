import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";

interface VendorDashboardLayoutProps {}

const VendorDashboardLayout = ({}: VendorDashboardLayoutProps) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isRTL = language === "ar";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Sign-out navigation handled elsewhere if needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        <VendorSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCollapseChange={setIsSidebarCollapsed}
        />

        {/* Main content with proper spacing for sidebar */}
        <main
          className={`flex-1 transition-all duration-300 min-h-[calc(100vh-64px)] ${
            isSidebarCollapsed ? "ms-20" : "ms-64"
          }`}
        >
          <div className="p-6">
            <div className="mx-auto">
              {/* Page Content Container */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-180px)]">
                <div className="p-6">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboardLayout;
