
import React from 'react';
import { Menu, Bell, Search, User, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from '@supabase/supabase-js';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AdminHeaderProps {
  user: UserType | null;
  onSignOut: () => void;
  onSettings: () => void;
  onMenuClick: () => void;
}

const AdminHeader = ({ user, onSignOut, onSettings, onMenuClick }: AdminHeaderProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-lg sticky top-0 z-50">
      <div className={`flex items-center justify-between px-4 sm:px-6 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Left Section - Menu and Title */}
        <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-blue-50 p-2 rounded-xl transition-all duration-200"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
          
          <div className={`hidden md:flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className={`text-xl font-bold text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('adminDashboard')}
                </h1>
                <p className={`text-sm text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('management')} {t('system')}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              {isRTL ? 'مباشر' : 'Live'}
            </Badge>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className={`hidden md:flex items-center flex-1 max-w-md mx-8 ${isRTL ? 'ml-8 mr-4' : 'mr-8 ml-4'}`}>
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
              isRTL ? 'right-4' : 'left-4'
            }`} />
            <Input
              type="search"
              placeholder={t('search')}
              className={`${isRTL ? 'pr-12 pl-4 text-right font-arabic' : 'pl-12 pr-4'} 
                bg-gray-50/80 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 
                focus:border-transparent rounded-xl h-11 transition-all duration-200`}
            />
          </div>
        </div>

        {/* Right Section - Actions and User */}
        <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative hover:bg-blue-50 p-3 rounded-xl transition-all duration-200 group"
          >
            <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs border-2 border-white">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-3 hover:bg-blue-50 p-2 rounded-xl transition-all duration-200 ${
                  isRTL ? 'space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-9 w-9 ring-2 ring-blue-100">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`hidden md:block ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                  <p className="text-sm font-semibold text-gray-900">
                    {isRTL ? 'المدير' : 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 max-w-32 truncate">
                    {user?.email}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isRTL ? 'start' : 'end'} 
              className="w-56 rounded-xl border-gray-200 shadow-lg"
            >
              <DropdownMenuItem className={`flex items-center space-x-3 p-3 ${isRTL ? 'space-x-reverse text-right' : ''}`}>
                <User className="h-4 w-4 text-blue-600" />
                <span className={isRTL ? 'font-arabic' : ''}>{t('profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onSettings}
                className={`flex items-center space-x-3 p-3 ${isRTL ? 'space-x-reverse text-right' : ''}`}
              >
                <Settings className="h-4 w-4 text-gray-600" />
                <span className={isRTL ? 'font-arabic' : ''}>{t('settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onSignOut}
                className={`flex items-center space-x-3 p-3 text-red-600 focus:text-red-600 cursor-pointer ${
                  isRTL ? 'space-x-reverse text-right' : ''
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span className={isRTL ? 'font-arabic' : ''}>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
