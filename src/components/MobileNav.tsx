
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { Home, Car, Heart, Menu } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  key: string;
  icon: LucideIcon | ((props: { className?: string }) => JSX.Element);
  href: string;
  count?: number;
}

const MobileNav = () => {
  const { t } = useLanguage();
  const { favoritesCount } = useFavorites();
  const { user } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { key: 'home', icon: Home, href: '/' },
    { key: 'cars', icon: Car, href: '/cars' },
    { key: 'offers', icon: ({ className }: { className?: string }) => (
      <div className={`${className} bg-accent rounded-lg p-1 text-black font-bold text-xs flex items-center justify-center`}>
        %
      </div>
    ), href: '/offers' },
    { key: 'vendors', icon: Car, href: '/vendors' },
    { key: 'more', icon: Menu, href: user ? '/dashboard' : '/more' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center py-2 safe-area-pb">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.key}
              to={item.href}
              className={`flex flex-col items-center justify-center p-2 transition-colors duration-200 relative ${
                isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <div className="relative">
                <IconComponent className="h-5 w-5 mb-1" />
                {item.count && item.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
