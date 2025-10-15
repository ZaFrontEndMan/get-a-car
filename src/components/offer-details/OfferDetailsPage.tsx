import React from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useRentalCarDetails } from "../../hooks/useRentalCarDetails";
import { useOfferDetailsState } from "../../hooks/useOfferDetailsState";
import SimilarCarsSlider from "../SimilarCarsSlider";
import BookingForm from "../BookingForm";
import OfferDetailsHeader from "../OfferDetailsHeader";
import OfferDetailsContent from "../OfferDetailsContent";
import OfferDetailsSidebar from "../OfferDetailsSidebar";
import OfferDetailsTerms from "../OfferDetailsTerms";
import OfferVendorSection from "./OfferVendorSection";
import OfferDetailsLoading from "./OfferDetailsLoading";
import OfferDetailsNotFound from "./OfferDetailsNotFound";

const OfferDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Determine if current route is car details route (/cars/:id)
  const isCarRoute = location.pathname.startsWith("/cars/");

  // Compute offerId and carId based on route type
  // - For /offers/:id: offerId comes from the path, carId from query (?carId=...)
  // - For /cars/:id: carId comes from the path, offerId is not required (set to 0)
  const pathId = id ? parseInt(id) : 0;
  const queryCarId = searchParams.get("carId")
    ? parseInt(searchParams.get("carId")!)
    : 0;

  const offerId = isCarRoute ? 0 : pathId;
  const carId = isCarRoute ? pathId : queryCarId;

  const { offer, loading, additionalServices } = useRentalCarDetails(
    carId,
    offerId
  );
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
    rentalDays,
    setRentalDays,
    calculateTotalPrice,
    handleBookNow,
    handleLoginSuccess,
  } = useOfferDetailsState();

  if (loading) {
    return <OfferDetailsLoading />;
  }

  if (!offer) {
    return <OfferDetailsNotFound />;
  }

  const pricingBreakdown = calculateTotalPrice(offer, additionalServices);

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Conditionally hide header on /cars/:id route */}
          {!isCarRoute && <OfferDetailsHeader offer={offer} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Images and Info */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="relative">
                  <img
                    src={offer.car.image}
                    alt={offer.car.name}
                    className="w-full h-80 md:h-96 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 rtl:gap-reverse">
                    <span className="font-medium text-sm">
                      {offer.car.rating}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({offer.car.reviews})
                    </span>
                  </div>
                  {offer.discount !== "0%" && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 rtl:gap-reverse">
                      <span className="font-bold text-sm">
                        {offer.discount} OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Car Details */}
              <OfferDetailsContent
                offer={offer}
                selectedPricing={selectedPricing}
              />

              {/* Vendor Section - Moved here under car features */}
              {offer.vendor && <OfferVendorSection vendor={offer.vendor} />}
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
              rentalDays={rentalDays}
              onRentalDaysChange={setRentalDays}
              pricingBreakdown={pricingBreakdown}
              onBookNow={handleBookNow}
            />
          </div>

          {isBookingOpen && (
            <BookingForm
              isLoggedUser={!isLoginOpen}
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
              car={offer.car}
              locations={{
                pickupLocations: offer.locations,
                dropoffLocations: offer.dropoffLocations,
              }}
              totalPrice={pricingBreakdown.totalPrice}
              selectedServices={selectedServices}
              pricingType={selectedPricing}
              selectedPickup={selectedPickup}
              selectedDropoff={selectedDropoff}
              rentalDays={rentalDays}
            />
          )}
          {/* Terms & Policies - Only offer-specific policies */}
          <div className="mt-8">
            <OfferDetailsTerms policies={offer.policies} offer={offer} />
          </div>

          {/* Similar Cars */}
          <div className="mt-12">
            <SimilarCarsSlider car={offer.car} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsPage;
