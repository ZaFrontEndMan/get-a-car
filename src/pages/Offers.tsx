import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import OfferCard from '../components/OfferCard';
import OffersHeader from '../components/offers/OffersHeader';
import OffersSearchControls from '../components/offers/OffersSearchControls';
import OffersFilters from '../components/offers/OffersFilters';
import OffersPagination from '../components/offers/OffersPagination';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Offers = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 12;

  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      console.log('Fetching offers...');
      const { data, error } = await supabase
        .from('offers')
        .select(`
          id,
          title,
          title_ar,
          description,
          description_ar,
          discount_percentage,
          valid_until,
          cars (
            id,
            name,
            images,
            daily_rate
          ),
          vendors (
            id,
            name,
            logo_url
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }

      console.log('Offers fetched successfully:', data);

      return data?.map(offer => ({
        id: offer.id,
        title: offer.title || 'No title',
        title_ar: offer.title_ar || '',
        description: offer.description || 'No description',
        description_ar: offer.description_ar || '',
        discount: `${offer.discount_percentage || 0}%`,
        validUntil: offer.valid_until,
        image: offer.cars?.images?.[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442',
        price: offer.cars?.daily_rate || 0,
        vendorName: offer.vendors?.name || 'Unknown Vendor',
        terms: [
          'Valid for limited time only',
          'Cannot be combined with other offers',
          'Subject to availability'
        ],
        vendor: offer.vendors ? {
          id: offer.vendors.id,
          name: offer.vendors.name,
          logo_url: offer.vendors.logo_url
        } : undefined
      })) || [];
    },
  });

  // Apply filters
  const filteredOffers = offers.filter(offer => {
    const searchTitle = language === 'ar' && offer.title_ar ? offer.title_ar : offer.title;
    const searchDescription = language === 'ar' && offer.description_ar ? offer.description_ar : offer.description;
    
    const matchesSearch = searchTerm === '' || 
                         searchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         searchDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = offer.price >= priceRange[0] && offer.price <= priceRange[1];
    
    const matchesVendor = selectedVendors.length === 0 || 
                         selectedVendors.some(vendorId => offer.vendorName.toLowerCase().includes(vendorId.toLowerCase()));

    return matchesSearch && matchesPrice && matchesVendor;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  const clearAllFilters = () => {
    console.log('Clearing all filters');
    setPriceRange([0, 2000]);
    setSelectedCategories([]);
    setSelectedVendors([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (error) {
    console.error('Error in offers page:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading offers</h3>
              <p className="text-gray-500">Please try again later</p>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading offers...</span>
          </div>
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-52 flex-shrink-0 hidden lg:block">
              <OffersFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedVendors={selectedVendors}
                setSelectedVendors={setSelectedVendors}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onClearFilters={clearAllFilters}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <OffersHeader />
              
              <OffersSearchControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                filteredOffersLength={filteredOffers.length}
                currentPage={currentPage}
                totalPages={totalPages}
              />

              {/* Offers Grid */}
              <div className={`grid gap-6 mb-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {paginatedOffers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <OfferCard offer={offer} />
                  </div>
                ))}
              </div>

              <OffersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />

              {filteredOffers.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
};

export default Offers;
