import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '../components/layout/navbar/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { LanguageProvider } from '../contexts/LanguageContext';
import BookingFlow from '../components/BookingFlow';
import { useCarDetails } from '../hooks/useCarDetails';
import { useCarDetailsState } from '../hooks/useCarDetailsState';
import CarDetailsMain from '../components/car-details/CarDetailsMain';
import CarDetailsSidebar from '../components/car-details/CarDetailsSidebar';
import CarDetailsVendorInfo from '../components/car-details/CarDetailsVendorInfo';
import SimilarCarsSlider from '../components/car-details/SimilarCarsSlider';

const CarDetailsContent = () => {
  const { id } = useParams();
  const { data: car, isLoading: carLoading } = useCarDetails(id);
  const {
    isBookingOpen,
    setIsBookingOpen,
    selectedServices,
    selectedPickup,
    selectedDropoff,
    totalPrice,
    handleBookNow
  } = useCarDetailsState();

  if (carLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-base">Loading car details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Car className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Car not found</h3>
              <Link to="/cars">
                <Button>Back to Cars</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate price range for similar cars (±30% of current car price)
  const priceRange: [number, number] = [
    Math.floor(car.daily_rate * 0.7),
    Math.ceil(car.daily_rate * 1.3)
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Breadcrumb - Hidden on mobile */}
          <div className="mb-6 hidden md:block">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
              <span className="text-gray-400">/</span>
              <Link to="/cars" className="text-gray-500 hover:text-primary">Cars</Link>
              <span className="text-gray-400">/</span>
              <span className="text-primary font-medium">{car.name}</span>
            </nav>
          </div>

          {/* Mobile Back Button */}
          <div className="mb-4 md:hidden">
            <Link to="/cars" className="flex items-center text-gray-600 hover:text-primary">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Cars</span>
            </Link>
          </div>

          {/* Mobile Layout - Stack vertically */}
          <div className="md:hidden space-y-4">
            {/* Main content first on mobile */}
            <CarDetailsMain car={car} />
            <CarDetailsVendorInfo car={car} />
            
            {/* Sidebar (rental period) after main content on mobile */}
            <CarDetailsSidebar car={car} onBookNow={handleBookNow} />
          </div>

          {/* Desktop Layout - Side by side */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8">
            {/* Main Car Info */}
            <div className="md:col-span-2 space-y-6">
              <CarDetailsMain car={car} />
              <CarDetailsVendorInfo car={car} />
            </div>

            {/* Sidebar - Sticky on desktop */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <CarDetailsSidebar car={car} onBookNow={handleBookNow} />
              </div>
            </div>
          </div>

          {/* Booking Form Section */}
          {isBookingOpen && (
            <div className="mt-8 mb-6">
              <div className="bg-white rounded-lg shadow-lg">
                <BookingFlow
                  isOpen={isBookingOpen}
                  onClose={() => setIsBookingOpen(false)}
                  car={{
                    id: car.id,
                    name: car.name,
                    brand: car.brand,
                    model: car.model,
                    image: car.images?.[0] || '/placeholder.svg',
                    daily_rate: car.daily_rate,
                    vendor_id: car.vendor_id,
                    pickup_locations: car.pickup_locations || [],
                    dropoff_locations: car.dropoff_locations || []
                  }}
                  totalPrice={totalPrice}
                  selectedServices={selectedServices}
                  pricingType="daily"
                  selectedPickup={selectedPickup}
                  selectedDropoff={selectedDropoff}
                  isInlineMode={true}
                />
              </div>
            </div>
          )}

          {/* Similar Cars Section */}
          <div className="mt-12">
            <SimilarCarsSlider 
              currentCarId={car.id}
              carType={car.type}
              priceRange={priceRange}
              locations={car.pickup_locations}
            />
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

const CarDetails = () => {
  return (
    <LanguageProvider>
      <CarDetailsContent />
    </LanguageProvider>
  );
};

export default CarDetails;
