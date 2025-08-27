
import React, { useState } from 'react';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminClients from './AdminClients';
import AdminVendors from './AdminVendors';
import AdminBookings from './AdminBookings';
import AdminPayments from './AdminPayments';
import AdminCountries from './AdminCountries';
import AdminCities from './AdminCities';
import AdminSettings from './AdminSettings';
import AdminBlogs from './AdminBlogs';
import AdminAchievements from './AdminAchievements';
import AdminTestimonials from './AdminTestimonials';
import AdminSliders from './AdminSliders';
import AdminDashboardLayout from './AdminDashboardLayout';

const AdminTabsNavigation = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUsers />;
      case 'clients':
        return <AdminClients />;
      case 'vendors':
        return <AdminVendors />;
      case 'bookings':
        return <AdminBookings />;
      case 'payments':
        return <AdminPayments />;
      case 'countries':
        return <AdminCountries />;
      case 'cities':
        return <AdminCities />;
      case 'sliders':
        return <AdminSliders />;
      case 'blogs':
        return <AdminBlogs />;
      case 'achievements':
        return <AdminAchievements />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <AdminDashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </AdminDashboardLayout>
  );
};

export default AdminTabsNavigation;
