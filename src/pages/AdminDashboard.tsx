
import React from 'react';
import AdminAccessGuard from '@/components/admin/AdminAccessGuard';
import AdminTabsNavigation from '@/components/admin/AdminTabsNavigation';

const AdminDashboard = () => {
  return (
    <AdminAccessGuard>
      <AdminTabsNavigation />
    </AdminAccessGuard>
  );
};

export default AdminDashboard;
