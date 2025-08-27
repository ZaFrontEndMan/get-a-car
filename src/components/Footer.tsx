import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Music, Youtube, Linkedin } from 'lucide-react';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();
  const { data: settings, isLoading } = useAdminSettings();

  const quickLinks = [
    { key: 'home', href: '/' },
    { key: 'cars', href: '/cars' },
    { key: 'offers', href: '/offers' },
    { key: 'blog', href: '/blog' },
    { key: 'contact', href: '/contact' }
  ];

  const usefulLinks = [
    { key: 'faq', href: '/faq' },
    { key: 'terms', href: '/terms' },
    { key: 'privacy', href: '/privacy' }
  ];

  const getSocialIcons = () => {
    const icons = [];
    
    if (settings?.facebookUrl) {
      icons.push({ name: 'Facebook', icon: Facebook, href: settings.facebookUrl });
    }
    if (settings?.instagramUrl) {
      icons.push({ name: 'Instagram', icon: Instagram, href: settings.instagramUrl });
    }
    if (settings?.twitterUrl) {
      icons.push({ name: 'X', icon: Twitter, href: settings.twitterUrl });
    }
    if (settings?.linkedinUrl) {
      icons.push({ name: 'LinkedIn', icon: Linkedin, href: settings.linkedinUrl });
    }
    if (settings?.youtubeUrl) {
      icons.push({ name: 'YouTube', icon: Youtube, href: settings.youtubeUrl });
    }

    // Fallback icons if no social media links are configured
    if (icons.length === 0) {
      return [
        { name: 'Facebook', icon: Facebook, href: '#' },
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'X', icon: Twitter, href: '#' },
        { name: 'TikTok', icon: Music, href: '#' }
      ];
    }

    return icons;
  };

  const currentYear = new Date().getFullYear();

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">{settings?.siteName || 'GetCar Rental'}</h3>
            </div>
            <p className="text-gray-300 text-sm">
              {settings?.siteDescription || 'Your trusted partner for premium car rental services across Saudi Arabia.'}
            </p>
            <div className="flex space-x-4">
              {getSocialIcons().map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-300 hover:text-primary transition-colors p-2"
                    aria-label={social.name}
                    target={social.href !== '#' ? '_blank' : '_self'}
                    rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('usefulLinks')}</h4>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('contactInfo')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-300 text-sm">{settings?.supportPhone || '+966 11 123 4567'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-300 text-sm">{settings?.contactEmail || 'info@getcar.sa'}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span className="text-gray-300 text-sm">
                  {settings?.address || 'King Fahd Road, Riyadh, Saudi Arabia'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {`© ${new Date().getFullYear()} ${settings?.siteName || 'GetCar'}. All rights reserved.`}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('terms')}
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
