
import React, { useState } from 'react';
import VendorDashboardLayout from '@/components/vendor/VendorDashboardLayout';
import VendorAuthGuard from '@/components/auth/VendorAuthGuard';
import VendorOverview from '@/components/vendor/VendorOverview';
import VendorBranches from '@/components/vendor/VendorBranches';
import VendorCars from '@/components/vendor/VendorCars';
import VendorOffers from '@/components/vendor/VendorOffers';
import VendorBookings from '@/components/vendor/VendorBookings';
import VendorUsers from '@/components/vendor/VendorUsers';
import VendorProfile from '@/components/vendor/VendorProfile';
import VendorPolicies from '@/components/vendor/VendorPolicies';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <VendorOverview />;
      case 'branches':
        return <VendorBranches />;
      case 'cars':
        return <VendorCars />;
      case 'offers':
        return <VendorOffers />;
      case 'bookings':
        return <VendorBookings />;
      case 'users':
        return <VendorUsers />;
      case 'profile':
        return <VendorProfile />;
      case 'policies':
        return <VendorPolicies />;
      default:
        return <VendorOverview />;
    }
  };

  return (
    <VendorAuthGuard>
      <VendorDashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </VendorDashboardLayout>
    </VendorAuthGuard>
  );
};

export default VendorDashboard;
