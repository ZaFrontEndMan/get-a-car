import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { User, CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import LoginModal from "@/components/LoginModal";
import BookingCarCard from "@/components/booking/BookingCarCard";
import BookingLocationStep from "@/components/booking/BookingLocationStep";
import BookingDriverStep from "@/components/booking/BookingDriverStep";
import BookingPaymentStep from "@/components/booking/BookingPaymentStep";
import BookingPriceSummary from "@/components/booking/BookingPriceSummary";
import BookingServicesDisplay from "@/components/booking/BookingServicesDisplay";
import { useCarAdditionalServices } from "@/hooks/useCarDetails";

interface BookingFlowProps {
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    image: string;
    daily_rate: number;
    vendor_id: string;
    pickup_locations?: string[];
    dropoff_locations?: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  totalPrice?: number;
  selectedServices?: string[];
  pricingType?: string;
  selectedPickup?: string;
  selectedDropoff?: string;
  isInlineMode?: boolean;
}

const BookingFlow = ({
  car,
  isOpen,
  onClose,
  totalPrice,
  selectedServices = [],
  pricingType = "daily",
  selectedPickup,
  selectedDropoff,
  isInlineMode = false,
}: BookingFlowProps) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const [needsDriver, setNeedsDriver] = useState(false);

  // Fetch additional services for this car
  const { data: carAdditionalServices = [], isLoading: servicesLoading } =
    useCarAdditionalServices(car.id);

  // Set default dates - pickup today, dropoff tomorrow
  const getDefaultPickupDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getDefaultDropoffDate = (pickupDate: string, days: number) => {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(pickup);
    dropoff.setDate(pickup.getDate() + days);
    return dropoff.toISOString().split("T")[0];
  };

  const [bookingData, setBookingData] = useState({
    pickupDate: getDefaultPickupDate(),
    returnDate: getDefaultDropoffDate(getDefaultPickupDate(), rentalDays),
    pickupLocation: selectedPickup || "",
    returnLocation: selectedDropoff || "",
    cardType: "",
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    driverName: "",
    licenseNumber: "",
    phoneNumber: "",
  });

  // Update dropoff date when rental days or pickup date changes
  useEffect(() => {
    const newDropoffDate = getDefaultDropoffDate(
      bookingData.pickupDate,
      rentalDays
    );
    setBookingData((prev) => ({
      ...prev,
      returnDate: newDropoffDate,
    }));
  }, [rentalDays, bookingData.pickupDate]);

  // Initialize pickup/dropoff locations when component mounts or props change
  useEffect(() => {
    setBookingData((prev) => ({
      ...prev,
      pickupLocation: selectedPickup || prev.pickupLocation,
      returnLocation: selectedDropoff || prev.returnLocation,
    }));
  }, [selectedPickup, selectedDropoff]);

  // Use pickup and dropoff locations from the car data, with fallback
  const pickupLocations =
    car.pickup_locations && car.pickup_locations.length > 0
      ? car.pickup_locations
      : [
          "Riyadh City Center",
          "King Khalid International Airport",
          "Al Olaya District",
          "King Abdulaziz Road",
          "Diplomatic Quarter",
          "Al Malaz District",
        ];

  const dropoffLocations =
    car.dropoff_locations && car.dropoff_locations.length > 0
      ? car.dropoff_locations
      : [
          "Riyadh City Center",
          "King Khalid International Airport",
          "Al Olaya District",
          "King Abdulaziz Road",
          "Diplomatic Quarter",
          "Al Malaz District",
        ];

  const getServiceDetails = () => {
    // Combine car's paid features with selected additional services
    const allServices = [
      ...carAdditionalServices,
      // Fallback services if no car services are available
      ...(carAdditionalServices.length === 0
        ? [
            { id: "insurance", name: "Full Insurance Coverage", price: 50 },
            { id: "gps", name: "GPS Navigation System", price: 25 },
            { id: "driver", name: "Professional Driver", price: 200 },
            { id: "delivery", name: "Car Delivery Service", price: 75 },
          ]
        : []),
    ];

    const filteredServices = allServices.filter((service) =>
      selectedServices.includes(service.id)
    );

    return filteredServices;
  };

  const calculateTotalPrice = () => {
    const basePrice = car.daily_rate * rentalDays;
    const servicesPrice = getServiceDetails().reduce(
      (total, service) => total + service.price,
      0
    );
    const total = basePrice + servicesPrice;

    return total;
  };

  const handleInputChange = (field: string, value: string) => {
    // Limit card number to 16 digits and only allow numbers
    if (field === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }

    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const adjustDays = (increment: boolean) => {
    const newDays = increment ? rentalDays + 1 : Math.max(1, rentalDays - 1);
    setRentalDays(newDays);

    // Update the return date when days change
    const newReturnDate = getDefaultDropoffDate(
      bookingData.pickupDate,
      newDays
    );
    setBookingData((prev) => ({
      ...prev,
      returnDate: newReturnDate,
    }));
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    toast.success(t("loginSuccessful") || "Login successful!");
    // Continue with booking after successful login
    setTimeout(() => {
      handleSubmitBooking();
    }, 500);
  };

  const handleSubmitBooking = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data: bookingNumberData, error: bookingNumberError } =
        await supabase.rpc("generate_booking_number");

      if (bookingNumberError) throw bookingNumberError;

      const totalAmount = calculateTotalPrice();
      const servicesTotal = getServiceDetails().reduce(
        (total, service) => total + service.price,
        0
      );

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          booking_number: bookingNumberData,
          car_id: car.id,
          vendor_id: car.vendor_id,
          customer_id: user.id,
          pickup_date: bookingData.pickupDate,
          return_date: bookingData.returnDate,
          pickup_location: bookingData.pickupLocation,
          return_location: bookingData.returnLocation,
          customer_name:
            user.user_metadata?.full_name || user.email || "Hafez Rahim",
          customer_email: user.email || "",
          customer_phone: user.user_metadata?.phone || "",
          total_days: rentalDays,
          daily_rate: car.daily_rate,
          subtotal: car.daily_rate * rentalDays,
          service_fees: servicesTotal,
          total_amount: totalAmount,
          additional_services: getServiceDetails(),
          booking_status: "pending",
          payment_status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(
        t("bookingSuccessful") || "Booking submitted successfully!"
      );
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        t("bookingFailed") || "Failed to submit booking. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Render inline mode (no modal overlay)
  if (isInlineMode) {
    return (
      <>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold text-primary">
                {t("completeBooking")}
              </h2>
              <p className="text-gray-600">{t("secureVehicleRental")}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Car Info Card */}
          <BookingCarCard
            car={car}
            rentalDays={rentalDays}
            onAdjustDays={adjustDays}
          />

          {/* Pickup & Dropoff Section */}
          <BookingLocationStep
            bookingData={bookingData}
            onInputChange={handleInputChange}
            pickupLocations={pickupLocations}
            dropoffLocations={dropoffLocations}
            selectedPickup={selectedPickup}
            selectedDropoff={selectedDropoff}
          />

          {/* Selected Services Display */}
          {selectedServices && selectedServices.length > 0 && (
            <BookingServicesDisplay
              selectedServices={selectedServices}
              getServiceDetails={getServiceDetails}
            />
          )}

          {/* Driver Option Section */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-2 rtl:gap-reverse mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold">{t("driverOption")}</h3>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{t("needDriverQuestion")}</p>
                  <p className="text-sm text-gray-600">
                    {t("professionalDriversAvailable")}
                  </p>
                </div>
                <Switch
                  checked={needsDriver}
                  onCheckedChange={setNeedsDriver}
                />
              </div>

              {needsDriver && (
                <div className="mt-4 space-y-4 p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-sm">
                    {t("driverInformation")}
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("fullName")} *
                      </label>
                      <Input
                        placeholder="Hafez Rahim"
                        value={bookingData.driverName}
                        onChange={(e) =>
                          handleInputChange("driverName", e.target.value)
                        }
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("drivingLicense")} *
                      </label>
                      <Input
                        placeholder={t("enterLicenseNumber")}
                        value={bookingData.licenseNumber}
                        onChange={(e) =>
                          handleInputChange("licenseNumber", e.target.value)
                        }
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("phoneNumber")} *
                      </label>
                      <Input
                        placeholder={t("enterPhoneNumber")}
                        value={bookingData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-2 rtl:gap-reverse mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold">
                {t("paymentInformation")}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("cardType")}
                </label>
                <Select
                  value={bookingData.cardType}
                  onValueChange={(value) =>
                    handleInputChange("cardType", value)
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={t("selectCardType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">{t("visa")}</SelectItem>
                    <SelectItem value="mastercard">
                      {t("mastercard")}
                    </SelectItem>
                    <SelectItem value="mada">{t("mada")}</SelectItem>
                    <SelectItem value="amex">{t("amex")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("cardNumber")}
                  </label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={bookingData.cardNumber}
                    onChange={(e) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    maxLength={16}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("cardholderName")}
                  </label>
                  <Input
                    placeholder="Hafez Rahim"
                    value={bookingData.cardholderName}
                    onChange={(e) =>
                      handleInputChange("cardholderName", e.target.value)
                    }
                    className="h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("expiryDate")}
                  </label>
                  <Input
                    placeholder="MM/YY"
                    value={bookingData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("cvv")}
                  </label>
                  <Input
                    placeholder="123"
                    value={bookingData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <BookingPriceSummary
            car={car}
            rentalDays={rentalDays}
            getServiceDetails={getServiceDetails}
            calculateTotalPrice={calculateTotalPrice}
          />

          {/* Complete Payment Button */}
          <Button
            onClick={handleSubmitBooking}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold rounded-lg"
          >
            {isLoading ? t("processingPayment") : t("completePayment")}
          </Button>

          <p className="text-center text-sm text-gray-500">
            🔒 {t("securePayment")}
          </p>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // Original modal mode
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-gray-50 rounded-lg max-w-2xl w-full max-h-[95vh] overflow-y-auto">
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-primary">
                  {t("completeBooking")}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {t("secureVehicleRental")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Car Info Card */}
            <BookingCarCard
              car={car}
              rentalDays={rentalDays}
              onAdjustDays={adjustDays}
            />

            {/* Pickup & Dropoff Section */}
            <BookingLocationStep
              bookingData={bookingData}
              onInputChange={handleInputChange}
              pickupLocations={pickupLocations}
              dropoffLocations={dropoffLocations}
              selectedPickup={selectedPickup}
              selectedDropoff={selectedDropoff}
            />

            {/* Selected Services Display */}
            {selectedServices && selectedServices.length > 0 && (
              <BookingServicesDisplay
                selectedServices={selectedServices}
                getServiceDetails={getServiceDetails}
              />
            )}

            {/* Driver Option Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-2 rtl:gap-reverse mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold">
                  {t("driverOption")}
                </h3>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {t("needDriverQuestion")}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {t("professionalDriversAvailable")}
                    </p>
                  </div>
                  <Switch
                    checked={needsDriver}
                    onCheckedChange={setNeedsDriver}
                  />
                </div>

                {needsDriver && (
                  <div className="mt-4 space-y-4 p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-sm">
                      {t("driverInformation")}
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t("fullName")} *
                        </label>
                        <Input
                          placeholder="Hafez Rahim"
                          value={bookingData.driverName}
                          onChange={(e) =>
                            handleInputChange("driverName", e.target.value)
                          }
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t("drivingLicense")} *
                        </label>
                        <Input
                          placeholder={t("enterLicenseNumber")}
                          value={bookingData.licenseNumber}
                          onChange={(e) =>
                            handleInputChange("licenseNumber", e.target.value)
                          }
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t("phoneNumber")} *
                        </label>
                        <Input
                          placeholder={t("enterPhoneNumber")}
                          value={bookingData.phoneNumber}
                          onChange={(e) =>
                            handleInputChange("phoneNumber", e.target.value)
                          }
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-2 rtl:gap-reverse mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold">
                  {t("paymentInformation")}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("cardType")}
                  </label>
                  <Select
                    value={bookingData.cardType}
                    onValueChange={(value) =>
                      handleInputChange("cardType", value)
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={t("selectCardType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">{t("visa")}</SelectItem>
                      <SelectItem value="mastercard">
                        {t("mastercard")}
                      </SelectItem>
                      <SelectItem value="mada">{t("mada")}</SelectItem>
                      <SelectItem value="amex">{t("amex")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("cardNumber")}
                    </label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={bookingData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      maxLength={16}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("cardholderName")}
                    </label>
                    <Input
                      placeholder="Hafez Rahim"
                      value={bookingData.cardholderName}
                      onChange={(e) =>
                        handleInputChange("cardholderName", e.target.value)
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("expiryDate")}
                    </label>
                    <Input
                      placeholder="MM/YY"
                      value={bookingData.expiryDate}
                      onChange={(e) =>
                        handleInputChange("expiryDate", e.target.value)
                      }
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("cvv")}
                    </label>
                    <Input
                      placeholder="123"
                      value={bookingData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <BookingPriceSummary
              car={car}
              rentalDays={rentalDays}
              getServiceDetails={getServiceDetails}
              calculateTotalPrice={calculateTotalPrice}
            />

            {/* Complete Payment Button */}
            <Button
              onClick={handleSubmitBooking}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg"
            >
              {isLoading ? t("processingPayment") : t("completePayment")}
            </Button>

            <p className="text-center text-xs sm:text-sm text-gray-500">
              🔒 {t("securePayment")}
            </p>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default BookingFlow;
