
import React from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import FavoritesList from '../components/dashboard/FavoritesList';

const FavoritesContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FavoritesList />
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
};

const Favorites = () => {
  return (
    <LanguageProvider>
      <FavoritesContent />
    </LanguageProvider>
  );
};

export default Favorites;
