
import React from 'react';
import { useDashboardAuth } from './hooks/useDashboardAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import DashboardLogo from './components/DashboardLogo';
import DashboardUserInfo from './components/DashboardUserInfo';
import DashboardMobileMenuButton from './components/DashboardMobileMenuButton';

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { handleLogout, getUserDisplayName } = useDashboardAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4 rtl:gap-reverse">
          <DashboardMobileMenuButton 
            isSidebarOpen={isSidebarOpen}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <DashboardLogo />
        </div>
        <DashboardUserInfo 
          userDisplayName={getUserDisplayName()}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default DashboardHeader;
