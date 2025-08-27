import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import MobileNav from "../MobileNav";

const ClientLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 ">
        {/* Side Navigation */}
        <div className=" mt-16 overflow-hidden">
          <DashboardSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarExpanded={isSidebarExpanded}
            setIsSidebarExpanded={setIsSidebarExpanded}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Background with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center "
            style={{
              backgroundImage: "url('/background.png')",
            }}
          />

          {/* Content Container */}
          <div className="relative min-h-full p-4 overflow-auto ">
            <main className="flex-grow p-8 border  border-slate-200 rounded-2xl mt-20 bg-slate-50  space-y-4 shadow-sm  bg-opacity-90">
              <Outlet />{" "}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
