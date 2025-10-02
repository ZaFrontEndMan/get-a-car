
import React from 'react';
import { Car } from 'lucide-react';

const DashboardLogo = () => {
  return (
    <div className="flex items-center gap-2 rtl:gap-reverse">
      <div className="gradient-primary p-2 rounded-lg">
        <Car className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold text-gradient">Get Car</span>
    </div>
  );
};

export default DashboardLogo;
