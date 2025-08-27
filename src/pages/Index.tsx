
import React from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import HeroSlider from '../components/HeroSlider';
import SearchBar from '../components/SearchBar';
import OffersSection from '../components/OffersSection';
import TopVendorsSection from '../components/TopVendorsSection';
import PopularCarsSection from '../components/PopularCarsSection';
import AchievementsSection from '../components/AchievementsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-cream">
        <Navbar />
        
        {/* Hero Section with Slider and Search - Fixed spacing */}
        <section className="relative pt-16">
          <HeroSlider />
          <SearchBar />
        </section>

        {/* Main Content */}
        <main className="pt-8">
          <OffersSection />
          <TopVendorsSection />
          <PopularCarsSection />
          <AchievementsSection />
          <TestimonialsSection />
        </main>

        <Footer />
        <MobileNav />
      </div>
    </LanguageProvider>
  );
};

export default Index;
