import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useCarsData } from '../hooks/useCarsData';
import Navbar from '../components/layout/navbar/Navbar';
import MobileNav from '../components/MobileNav';
import Filters from '../components/Filters';
import Footer from '../components/Footer';
import CarsFilters from '../components/cars/CarsFilters';
import CarsHeader from '../components/cars/CarsHeader';
import CarsSearch from '../components/cars/CarsSearch';
import CarsGrid from '../components/cars/CarsGrid';
import CarsPagination from '../components/cars/CarsPagination';

const CarsContent = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle search parameters from URL
  useEffect(() => {
    const pickup = searchParams.get('pickup');
    const dropoff = searchParams.get('dropoff');
    const pickupDate = searchParams.get('pickupDate');
    const dropoffDate = searchParams.get('dropoffDate');
    const withDriver = searchParams.get('withDriver');

    console.log('Search parameters:', { pickup, dropoff, pickupDate, dropoffDate, withDriver });

    // Apply location filters if provided
    if (pickup) {
      setSelectedLocations(prev => {
        if (!prev.includes(pickup)) {
          return [...prev, pickup];
        }
        return prev;
      });
    }

    if (dropoff && dropoff !== pickup) {
      setSelectedLocations(prev => {
        if (!prev.includes(dropoff)) {
          return [...prev, dropoff];
        }
        return prev;
      });
    }

    // You can add more logic here to handle dates and driver preference
  }, [searchParams]);

  // Fetch cars from Supabase with filters applied
  const { data: allCars = [], isLoading } = useCarsData({
    searchTerm,
    priceRange,
    selectedTypes,
    selectedCapacity,
    selectedTransmission,
    selectedBrands,
    selectedFeatures,
    selectedLocations,
    selectedVendors
  });

  const handleFilterChange = (filters: any) => {
    console.log('Mobile filters applied:', filters);
    if (filters.priceRange) setPriceRange(filters.priceRange);
    if (filters.selectedBrands) setSelectedBrands(filters.selectedBrands);
    if (filters.selectedTypes) setSelectedTypes(filters.selectedTypes);
    if (filters.selectedFeatures) setSelectedFeatures(filters.selectedFeatures);
    if (filters.selectedLocations) setSelectedLocations(filters.selectedLocations);
    if (filters.selectedCapacity) setSelectedCapacity(filters.selectedCapacity);
    if (filters.selectedTransmission) setSelectedTransmission(filters.selectedTransmission);
    setCurrentPage(1);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleCapacityToggle = (capacity: string) => {
    setSelectedCapacity(prev => 
      prev.includes(capacity) ? prev.filter(c => c !== capacity) : [...prev, capacity]
    );
    setCurrentPage(1);
  };

  const handleTransmissionToggle = (transmission: string) => {
    setSelectedTransmission(prev => 
      prev.includes(transmission) ? prev.filter(t => t !== transmission) : [...prev, transmission]
    );
    setCurrentPage(1);
  };

  const handleVendorToggle = (vendor: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendor) ? prev.filter(v => v !== vendor) : [...prev, vendor]
    );
    setCurrentPage(1);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
    setCurrentPage(1);
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedTypes([]);
    setSelectedCapacity([]);
    setSelectedTransmission([]);
    setSelectedVendors([]);
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setSelectedLocations([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Pagination logic
  const carsPerPage = 12;
  const totalPages = Math.ceil(allCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const currentCars = allCars.slice(startIndex, startIndex + carsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading cars...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">
          {/* Desktop Sidebar Filters */}
          <CarsFilters
            priceRange={priceRange}
            selectedTypes={selectedTypes}
            selectedCapacity={selectedCapacity}
            selectedTransmission={selectedTransmission}
            selectedVendors={selectedVendors}
            selectedBrands={selectedBrands}
            selectedFeatures={selectedFeatures}
            selectedLocations={selectedLocations}
            onPriceRangeChange={setPriceRange}
            onTypeToggle={handleTypeToggle}
            onCapacityToggle={handleCapacityToggle}
            onTransmissionToggle={handleTransmissionToggle}
            onVendorToggle={handleVendorToggle}
            onBrandToggle={handleBrandToggle}
            onFeatureToggle={handleFeatureToggle}
            onLocationToggle={handleLocationToggle}
            onClearAll={clearAllFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            <CarsHeader />

            <CarsSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onFiltersOpen={() => setIsFilterOpen(true)}
              currentCars={currentCars}
              currentPage={currentPage}
              totalPages={totalPages}
            />

            <CarsGrid cars={currentCars} viewMode={viewMode} />

            <CarsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <Filters 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onFilterChange={handleFilterChange}
        priceRange={priceRange}
        selectedBrands={selectedBrands}
        selectedTypes={selectedTypes}
        selectedFeatures={selectedFeatures}
        selectedLocations={selectedLocations}
        selectedCapacity={selectedCapacity}
        selectedTransmission={selectedTransmission}
        onPriceRangeChange={setPriceRange}
        onBrandToggle={handleBrandToggle}
        onTypeToggle={handleTypeToggle}
        onFeatureToggle={handleFeatureToggle}
        onLocationToggle={handleLocationToggle}
        onCapacityToggle={handleCapacityToggle}
        onTransmissionToggle={handleTransmissionToggle}
        onClearAll={clearAllFilters}
      />

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
};

const Cars = () => {
  return (
    <LanguageProvider>
      <CarsContent />
    </LanguageProvider>
  );
};

export default Cars;
