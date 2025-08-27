
import React from 'react';
import { 
  BarChart3, 
  Building2, 
  Car, 
  Calendar, 
  Users, 
  Settings, 
  Tag,
  Shield,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VendorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const VendorSidebar = ({ isOpen, onClose, activeTab, onTabChange }: VendorSidebarProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const menuItems = [
    {
      id: 'overview',
      name: language === 'ar' ? 'نظرة عامة' : 'Overview',
      icon: BarChart3,
    },
    {
      id: 'branches',
      name: language === 'ar' ? 'الفروع' : 'Branches',
      icon: Building2,
    },
    {
      id: 'cars',
      name: language === 'ar' ? 'السيارات' : 'Cars',
      icon: Car,
    },
    {
      id: 'offers',
      name: language === 'ar' ? 'العروض' : 'Offers',
      icon: Tag,
    },
    {
      id: 'bookings',
      name: language === 'ar' ? 'الحجوزات' : 'Bookings',
      icon: Calendar,
    },
    {
      id: 'policies',
      name: language === 'ar' ? 'السياسات' : 'Policies',
      icon: Shield,
    },
    {
      id: 'users',
      name: language === 'ar' ? 'المستخدمون' : 'Users',
      icon: Users,
    },
    {
      id: 'profile',
      name: language === 'ar' ? 'الملف الشخصي' : 'Profile',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-16 h-[calc(100vh-64px)] w-64 
        bg-white shadow-lg z-50 transform transition-transform duration-300
        ${isRTL ? 'right-0 border-l border-gray-200' : 'left-0 border-r border-gray-200'}
        ${isOpen 
          ? 'translate-x-0' 
          : isRTL ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'
        }
        overflow-y-auto
      `}>
        {/* Mobile close button */}
        <div className="md:hidden flex justify-between items-center p-4 border-b">
          <h2 className={`font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'القائمة' : 'Menu'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isRTL 
                      ? 'flex-row-reverse text-right' 
                      : 'flex-row text-left'
                    }
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className="flex-1">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default VendorSidebar;
