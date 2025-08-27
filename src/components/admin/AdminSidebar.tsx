
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  Calendar, 
  CreditCard, 
  Settings,
  FileText,
  Trophy,
  MessageSquare,
  Image,
  Globe,
  MapPin,
  Shield
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ activeTab, onTabChange, isOpen, onClose }: AdminSidebarProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const menuItems = [
    { id: 'overview', label: t('overview'), icon: LayoutDashboard },
    { id: 'users', label: t('users'), icon: Users },
    { id: 'clients', label: t('clients'), icon: UserCheck },
    { id: 'vendors', label: t('vendors'), icon: Building2 },
    { id: 'bookings', label: t('bookings'), icon: Calendar },
    { id: 'payments', label: t('payments'), icon: CreditCard },
    { id: 'countries', label: t('countries'), icon: Globe },
    { id: 'cities', label: t('cities'), icon: MapPin },
    { id: 'sliders', label: t('sliders'), icon: Image },
    { id: 'blogs', label: t('blogs'), icon: FileText },
    { id: 'achievements', label: t('achievements'), icon: Trophy },
    { id: 'testimonials', label: t('testimonials'), icon: MessageSquare },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <>
      {/* Enhanced Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300" 
          onClick={onClose}
        />
      )}
      
      {/* Enhanced Sidebar */}
      <div className={cn(
        "fixed top-16 h-[calc(100vh-64px)] w-72 bg-white/95 backdrop-blur-md shadow-2xl border-gray-200/60 transform transition-all duration-300 ease-in-out z-50 custom-scrollbar",
        isRTL ? "right-0 border-l" : "left-0 border-r",
        isOpen 
          ? isRTL ? "translate-x-0" : "translate-x-0"
          : isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Enhanced Header */}
        <div className="p-6 border-b border-gray-200/60 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/20 rounded-full" />
          </div>
          
          <div className={cn(
            "flex items-center space-x-3 relative",
            isRTL && "space-x-reverse"
          )}>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h2 className={`text-lg font-bold text-white ${isRTL ? 'font-arabic' : ''}`}>
                {t('adminPanel')}
              </h2>
              <p className={`text-blue-100 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'نظام الإدارة' : 'Management System'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Navigation */}
        <nav className="py-6 px-4 space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose?.();
                }}
                className={cn(
                  "w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                  isRTL ? "text-right" : "text-left",
                  isActive 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100 scale-[1.02]" 
                    : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm hover:scale-[1.01]"
                )}
              >
                {/* Background effect for active item */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-2xl" />
                )}
                
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200 relative z-10",
                  isRTL ? "ml-4" : "mr-4",
                  isActive ? "text-blue-600 scale-110" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span className={cn(
                  "font-medium relative z-10 transition-all duration-200",
                  isRTL ? 'font-arabic text-right' : '',
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full",
                    isRTL ? "left-1" : "right-1"
                  )} />
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-blue-50/0 to-blue-50/0 group-hover:via-blue-50/50 transition-all duration-300" />
              </button>
            );
          })}
        </nav>
        
        {/* Enhanced Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/60 bg-gradient-to-t from-gray-50/80 to-transparent backdrop-blur-sm">
          <div className={`text-center text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
            © 2024 GetCar Admin Panel
          </div>
          <div className="mt-2 h-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full" />
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
