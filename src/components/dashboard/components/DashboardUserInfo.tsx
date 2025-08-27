
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
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <span className="text-gray-700">Welcome, {userDisplayName}</span>
      <button 
        onClick={onLogout}
        className="flex items-center space-x-2 rtl:space-x-reverse text-red hover:text-red/80"
      >
        <LogOut className="h-5 w-5" />
        <span>{t('logout')}</span>
      </button>
    </div>
  );
};

export default DashboardUserInfo;
