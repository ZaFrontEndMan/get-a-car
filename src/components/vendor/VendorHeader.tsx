
import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/layout/navbar/LanguageSwitcher';

interface VendorHeaderProps {
  onMenuClick: () => void;
}

const VendorHeader = ({ onMenuClick }: VendorHeaderProps) => {
  const { signOut } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Vendor logout initiated');
      await signOut();
      toast.success(t('signOut') + ' successfully');
      // signOut already handles navigation - no need for manual navigation
    } catch (error) {
      console.error('Vendor logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{t('vendorDashboard')}</h1>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
            title={t('logout')}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2 rtl:ml-0 rtl:mr-2 hidden sm:inline">{t('logout')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
