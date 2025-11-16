import React, { useState } from "react";
import {
  useParams,
  useSearchParams,
  useLocation,
  Link,
} from "react-router-dom";
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
import { formatPricingBreakdown } from "@/utils/pricingCalculator";
import LazyImage from "../ui/LazyImage";

// --- Simple dialog/modal for image preview ---
const ImageDialog = ({ openImage, onClose }) =>
  openImage ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
      style={{ cursor: "zoom-out" }}
    >
      <LazyImage
        src={openImage}
        alt="Car Large"
        className="max-w-[90vw] max-h-[90vh] rounded-xl border-white border-2 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  ) : null;

const OfferDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { t } = useLanguage();
  const [openImage, setOpenImage] = useState<string | null>(null);
  const initialPickupLocation = searchParams.get("pickupLocation") || "";
  const initialDropOffLocation = searchParams.get("dropOffLocation") || "";
  const initialPickupDate = searchParams.get("pickupDate") || "";
  const initialDropoffDate = searchParams.get("dropoffDate") || "";
  // Determine if current route is car details route (/cars/:id)
  const isCarRoute = location.pathname.startsWith("/cars/");
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
    pickupDate,
    setPickupDate,
    dropoffDate,
    setDropoffDate,
  } = useOfferDetailsState({
    pickupLocation: initialPickupLocation,
    dropOffLocation: initialDropOffLocation,
    pickupDate: initialPickupDate,
    dropoffDate: initialDropoffDate,
  });

  if (loading) {
    return <OfferDetailsLoading />;
  }

  if (!offer) {
    return <OfferDetailsNotFound />;
  }

  const pricingBreakdown = calculateTotalPrice(offer, additionalServices);
  const formattedPricing = formatPricingBreakdown(
    pricingBreakdown,
    t("currency")
  );

  return (
    <div className="min-h-screen">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isCarRoute && <OfferDetailsHeader offer={offer} />}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Images and Info */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="relative">
                  {/* Car Images - up to 5, as slider or gallery */}
                  <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-gray-50 border-b">
                    {offer.car.gallery?.slice(0, 5).map((img, i) => (
                      <LazyImage
                        key={i}
                        src={img}
                        alt={`Car ${i + 1}`}
                        className="h-20 w-32 rounded-lg shadow cursor-zoom-in object-cover ring-1 ring-gray-200"
                        onClick={() => setOpenImage(img)}
                      />
                    ))}
                  </div>
                  {/* Main car "hero" image */}
                  <LazyImage
                    src={offer.car.image}
                    alt={offer.car.name}
                    className="w-full h-80 md:h-96 object-cover"
                  />
                  {offer?.vendor?.image && offer?.vendor?.id && (
                    <div className="absolute bottom-3 end-3 w-16 h-16 rounded-full bg-white shadow-md overflow-hidden border-2 border-white hover:scale-110 transition duration-300">
                      <Link to={`/vendors/${offer?.vendor?.id}`}>
                        <LazyImage
                          title={offer?.vendor.name}
                          src={offer?.vendor.image}
                          alt={offer?.vendor.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                  )}
                  {offer.discount !== 0 && (
                    <div className="absolute top-5 end-5 bg-red-500 bg-black/40 text-white px-3 py-1.5 rounded-full flex items-center gap-1 rtl:gap-reverse">
                      <span className="font-bold text-sm">
                        {`${offer.discount}% ${t("discount")} `}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Dialog for image preview */}
              <ImageDialog
                openImage={openImage}
                onClose={() => setOpenImage(null)}
              />

              <OfferDetailsContent
                offer={offer}
                selectedPricing={selectedPricing}
              />

              {/* {offer.vendor && <OfferVendorSection vendor={offer.vendor} />} */}
              {isBookingOpen && (
                <BookingForm
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  dropoffDate={dropoffDate}
                  setDropoffDate={setDropoffDate}
                  pricingBreakdown={pricingBreakdown}
                  setRentalDays={setRentalDays}
                  isLoggedUser={!isLoginOpen}
                  isOpen={isBookingOpen}
                  onClose={() => setIsBookingOpen(false)}
                  car={offer.car}
                  locations={{
                    pickupLocations: offer.locations,
                    dropoffLocations: offer.dropoffLocations,
                  }}
                  vendor={offer?.vendor}
                  totalPrice={pricingBreakdown.totalPrice}
                  selectedServices={selectedServices}
                  pricingType={selectedPricing}
                  selectedPickup={selectedPickup}
                  selectedDropoff={selectedDropoff}
                  rentalDays={rentalDays}
                  formattedPricing={formattedPricing}
                />
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
              rentalDays={rentalDays}
              onRentalDaysChange={setRentalDays}
              pricingBreakdown={pricingBreakdown}
              onBookNow={handleBookNow}
            />
          </div>

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
