
import React from 'react';
import { Navigate } from 'react-router-dom';

const VendorDashboard = () => {
  // This page is no longer used directly; vendor dashboard now uses nested routes under /vendor-dashboard
  // Keep a safe redirect in case anything still points here.
  return <Navigate to="/vendor-dashboard/overview" replace />;
};

export default VendorDashboard;
