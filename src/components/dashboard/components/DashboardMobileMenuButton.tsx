
import React from 'react';
import { Menu, X } from 'lucide-react';

interface DashboardMobileMenuButtonProps {
  isSidebarOpen: boolean;
  onClick: () => void;
}

const DashboardMobileMenuButton = ({ isSidebarOpen, onClick }: DashboardMobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
    >
      {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
};

export default DashboardMobileMenuButton;
