
import React from 'react';
import { LogOut } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface DashboardUserInfoProps {
  userDisplayName: string;
  onLogout: () => void;
}

const DashboardUserInfo = ({ userDisplayName, onLogout }: DashboardUserInfoProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-4 rtl:gap-reverse">
      <span className="text-gray-700">Welcome, {userDisplayName}</span>
      <button 
        onClick={onLogout}
        className="flex items-center gap-2 rtl:gap-reverse text-red hover:text-red/80"
      >
        <LogOut className="h-5 w-5" />
        <span>{t('logout')}</span>
      </button>
    </div>
  );
};

export default DashboardUserInfo;
