
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
import { useLocation, useNavigate } from 'react-router-dom';

interface VendorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const VendorSidebar = ({ isOpen, onClose }: VendorSidebarProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = '/vendor-dashboard';

  const menuItems = [
    {
      id: 'overview',
      name: language === 'ar' ? 'نظرة عامة' : 'Overview',
      icon: BarChart3,
      path: `${basePath}/overview`,
    },
    {
      id: 'branches',
      name: language === 'ar' ? 'الفروع' : 'Branches',
      icon: Building2,
      path: `${basePath}/branches`,
    },
    {
      id: 'cars',
      name: language === 'ar' ? 'السيارات' : 'Cars',
      icon: Car,
      path: `${basePath}/cars`,
    },
    {
      id: 'offers',
      name: language === 'ar' ? 'العروض' : 'Offers',
      icon: Tag,
      path: `${basePath}/offers`,
    },
    {
      id: 'bookings',
      name: language === 'ar' ? 'الحجوزات' : 'Bookings',
      icon: Calendar,
      path: `${basePath}/bookings`,
    },
    {
      id: 'policies',
      name: language === 'ar' ? 'السياسات' : 'Policies',
      icon: Shield,
      path: `${basePath}/policies`,
    },
    {
      id: 'users',
      name: language === 'ar' ? 'المستخدمون' : 'Users',
      icon: Users,
      path: `${basePath}/users`,
    },
    {
      id: 'profile',
      name: language === 'ar' ? 'الملف الشخصي' : 'Profile',
      icon: Settings,
      path: `${basePath}/profile`,
    },
  ];

  const isRouteActive = (itemPath: string, id: string) => {
    const { pathname } = location;
    if (id === 'overview') {
      return pathname === basePath || pathname.startsWith(itemPath);
    }
    return pathname.startsWith(itemPath);
  };

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
              const isActive = isRouteActive(item.path, item.id);
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
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
