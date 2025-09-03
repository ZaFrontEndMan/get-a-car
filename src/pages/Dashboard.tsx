import React, { useState } from "react";
import Navbar from "../components/layout/navbar/Navbar";
import MobileNav from "../components/MobileNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import BookingsList from "../components/dashboard/BookingsList";
import FavoritesList from "../components/dashboard/FavoritesList";
import PaymentsList from "../components/dashboard/PaymentsList";
import ProfileSection from "../components/dashboard/ProfileSection";
import SupportSection from "../components/dashboard/SupportSection";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingsList />;
      case "favorites":
        return <FavoritesList />;
      case "payments":
        return <PaymentsList />;
      case "profile":
        return <ProfileSection />;
      case "support":
        return <SupportSection />;
      default:
        return <BookingsList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Website Header for Web View */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Dashboard Header for Mobile/Tablet */}
      <div className="md:hidden">
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      <div className="flex pt-16 md:pt-20">
        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:ml-0 rtl:lg:mr-0 pb-20 md:pb-6">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      {/* Mobile Navigation for Mobile View */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
