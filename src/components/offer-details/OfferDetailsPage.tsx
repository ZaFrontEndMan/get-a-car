
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOfferDetails } from '../../hooks/useOfferDetails';
import { useOfferDetailsState } from '../../hooks/useOfferDetailsState';
import Navbar from '../Navbar';
import MobileNav from '../MobileNav';
import Footer from '../Footer';
import SimilarCarsSlider from '../SimilarCarsSlider';
import BookingForm from '../BookingForm';
import LoginModal from '../LoginModal';
import OfferDetailsHeader from '../OfferDetailsHeader';
import OfferDetailsContent from '../OfferDetailsContent';
import OfferDetailsSidebar from '../OfferDetailsSidebar';
import OfferDetailsTerms from '../OfferDetailsTerms';
import OfferVendorSection from './OfferVendorSection';
import OfferDetailsLoading from './OfferDetailsLoading';
import OfferDetailsNotFound from './OfferDetailsNotFound';

const OfferDetailsPage = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const { offer, loading, additionalServices } = useOfferDetails(id);
  const {
    selectedPricing,
    setSelectedPricing,
    selectedServices,
    setSelectedServices,
    selectedPickup,
    setSelectedPickup,
    selectedDropoff,
    setSelectedDropoff,
    isBookingOpen,
    setIsBookingOpen,
    isLoginOpen,
    setIsLoginOpen,
    calculateTotalPrice,
    handleBookNow,
    handleLoginSuccess
  } = useOfferDetailsState();

  if (loading) {
    return <OfferDetailsLoading />;
  }

  if (!offer) {
    return <OfferDetailsNotFound />;
  }

  const totalPrice = calculateTotalPrice(offer, additionalServices);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OfferDetailsHeader offer={offer} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Images and Info */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="relative">
                  <img src={offer.car.image} alt={offer.car.name} className="w-full h-80 md:h-96 object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1 rtl:space-x-reverse">
                    <span className="font-medium text-sm">{offer.car.rating}</span>
                    <span className="text-gray-600 text-sm">({offer.car.reviews})</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center space-x-1 rtl:space-x-reverse">
                    <span className="font-bold text-sm">{offer.discount} OFF</span>
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <OfferDetailsContent offer={offer} selectedPricing={selectedPricing} />

              {/* Vendor Section - Moved here under car features */}
              {offer.vendor && (
                <OfferVendorSection vendor={offer.vendor} />
              )}
            </div>

            {/* Booking Sidebar */}
            <OfferDetailsSidebar
              offer={offer}
              selectedPricing={selectedPricing}
              onPricingSelect={setSelectedPricing}
              additionalServices={additionalServices}
              selectedServices={selectedServices}
              onServicesChange={setSelectedServices}
              selectedPickup={selectedPickup}
              selectedDropoff={selectedDropoff}
              onPickupChange={setSelectedPickup}
              onDropoffChange={setSelectedDropoff}
              totalPrice={totalPrice}
              onBookNow={handleBookNow}
            />
          </div>

          {/* Terms & Policies - Only offer-specific policies */}
          <div className="mt-8">
            <OfferDetailsTerms policies={offer.policies} offer={offer} />
          </div>

          {/* Similar Cars */}
          <div className="mt-12">
            <SimilarCarsSlider currentCarId={offer.car.id} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingForm 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        car={offer.car}
        totalPrice={totalPrice}
        selectedServices={selectedServices}
        pricingType={selectedPricing}
        selectedPickup={selectedPickup}
        selectedDropoff={selectedDropoff}
      />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
};

export default OfferDetailsPage;
