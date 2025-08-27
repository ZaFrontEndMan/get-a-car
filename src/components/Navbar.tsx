import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('cars'), href: '/cars' },
    { name: t('vendors'), href: '/vendors' },
    { name: t('offers'), href: '/offers' },
    { name: t('contact'), href: '/contact' },
    { name: t('about'), href: '/about' }
  ];

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
      setShowUserMenu(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50 fixed w-full top-0 z-50 transition-all duration-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always visible */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-br from-primary via-secondary to-accent p-2 rounded-xl mr-2 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-accent transition-all duration-300">
                Get Car
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:block">
            <div className={`flex items-baseline ${isRTL ? 'space-x-reverse' : ''} space-x-6`}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-lift ${
                    location.pathname === item.href
                      ? 'text-white bg-gradient-to-r from-primary to-secondary shadow-lg'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50 hover:shadow-md'
                  } ${isRTL ? 'text-right' : 'text-left'}`}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg -z-10" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Side - Hidden on mobile */}
          <div className="hidden md:block">
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              {/* Language Switcher */}
              <div className="hover-lift">
                <LanguageSwitcher />
              </div>

              {!user ? (
                <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Link
                    to="/signin"
                    className="text-gray-700 hover:text-primary bg-transparent hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-lift border border-transparent hover:border-gray-200"
                  >
                    {t('signIn')}
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-accent px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover-lift shadow-md hover:shadow-lg"
                  >
                    {t('signUp')}
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    className="group relative p-2.5 bg-gray-50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 rounded-xl transition-all duration-300 hover-lift border border-gray-200 hover:border-primary/20"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <User className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300" />
                  </button>

                  {showUserMenu && (
                    <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-xl bg-white/95 backdrop-blur-md ring-1 ring-black/5 border border-gray-100 animate-fade-in z-50">
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className={`flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-primary transition-all duration-300 ${
                            isRTL ? 'text-right' : 'text-left'
                          }`}
                        >
                          <User className={`h-4 w-4 text-primary ${isRTL ? 'ml-3' : 'mr-3'}`} />
                          <span>{t('profile')}</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 ${
                            isRTL ? 'text-right' : 'text-left'
                          }`}
                        >
                          <LogOut className={`h-4 w-4 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                          <span>{t('signOut')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Side - Only visible on mobile */}
          <div className={`md:hidden flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Mobile Language Switcher */}
            <LanguageSwitcher />
            
            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              type="button"
              className="group p-2 bg-gray-100 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 rounded-lg transition-all duration-300 hover-lift border border-gray-200 hover:border-primary/20"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Fixed positioning and improved z-index */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed left-0 right-0 top-16 transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white shadow-xl border-t border-gray-200">
          <div className="px-4 pt-4 pb-3 space-y-2 max-h-screen overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover-lift ${
                  location.pathname === item.href
                    ? 'text-white bg-gradient-to-r from-primary to-secondary shadow-md'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                } ${isRTL ? 'text-right' : 'text-left'}`}
                aria-current={location.pathname === item.href ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile User Section */}
          <div className="pt-4 pb-6 border-t border-gray-200/50">
            <div className="px-4">
              {!user ? (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/signin"
                    className="text-center text-gray-700 hover:text-primary bg-transparent hover:bg-gray-50 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover-lift border border-gray-200 hover:border-primary/20"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('signIn')}
                  </Link>
                  <Link
                    to="/signup"
                    className="text-center bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-accent px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover-lift shadow-md hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('signUp')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-primary rounded-lg transition-all duration-300 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <User className={`h-5 w-5 text-primary ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    <span>{t('profile')}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-base text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    <LogOut className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    <span>{t('signOut')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
