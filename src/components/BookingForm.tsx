import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MapPin, CreditCard, Shield } from "lucide-react";
import { differenceInDays, addDays } from "date-fns";
import { createBookingSchema, BookingFormData } from "./booking/bookingSchema";
import BookingInvoice from "./booking/BookingInvoice";
import BookingCarInfo from "./booking/BookingCarInfo";
import BookingDateLocationStep from "./booking/BookingDateLocationStep";
import BookingServicesDisplay from "./booking/BookingServicesDisplay";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateBookingPrice, Service } from "../utils/pricingCalculator";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: string;
    name: string;
    brand: string;
    pricing: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    image: string;
  };
  totalPrice: number;
  selectedServices: string[];
  pricingType: string;
  selectedPickup?: string;
  selectedDropoff?: string;
  rentalDays?: number;
  locations?: string[];
  isLoggedUser: boolean;
}

// Schema for user verification form
const userVerificationSchema = z.object({
  user_id: z.string().min(1, { message: "user_id_required" }),
  license_id: z.string().min(1, { message: "license_id_required" }),
});

type UserVerificationFormData = z.infer<typeof userVerificationSchema>;

// Component for user verification before booking
const CheckUserBeforeBooking: React.FC<{
  onUserVerified: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}> = ({ onUserVerified, t }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<UserVerificationFormData>({
    resolver: zodResolver(userVerificationSchema),
    defaultValues: {
      user_id: "",
      license_id: "",
    },
  });

  const onSubmit = async (data: UserVerificationFormData) => {
    setIsVerifying(true);

    // Simulate API call with 0.5s delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock user existence check (replace with actual API call in production)
    const isUserValid = data.user_id.toLowerCase() === "existing_user";

    if (isUserValid) {
      toast({
        title: t("user_verified"),
        description: t("user_verified_description"),
      });
      onUserVerified();
    } else {
      // Construct query parameters
      const params = new URLSearchParams({
        user_id: data.user_id,
        license_id: data.license_id,
      });
      toast({
        title: t("user_not_found"),
        description: t("user_not_found_description"),
        variant: "destructive",
      });
      navigate(`/signup?${params.toString()}`);
    }

    setIsVerifying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row items-end w-full gap-2 justify-between my-4"
        >
          <div className="w-full md:w-5/12">
            <label className="text-sm font-medium text-gray-700">
              {t("nationalId")}
            </label>
            <Input
              {...form.register("user_id")}
              placeholder={t("enter_user_id")}
              className="rounded-lg border-gray-300"
              disabled={isVerifying}
            />
            {form.formState.errors.user_id && (
              <p className="text-sm text-red">
                {t(form.formState.errors.user_id.message!)}
              </p>
            )}
          </div>
          <div className="w-full md:w-5/12">
            <label className="text-sm font-medium text-gray-700">
              {t("license_id")}
            </label>
            <Input
              {...form.register("license_id")}
              placeholder={t("enter_license_id")}
              className="rounded-lg border-gray-300"
              disabled={isVerifying}
            />
            {form.formState.errors.license_id && (
              <p className="text-sm text-red">
                {t(form.formState.errors.license_id.message!)}
              </p>
            )}
          </div>
          <Button
            className="w-full md:w-2/12"
            type="submit"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                {t("verifying")}
              </>
            ) : (
              t("verify_and_continue")
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

const BookingForm = ({
  isOpen,
  onClose,
  car,
  selectedServices,
  pricingType,
  selectedPickup,
  selectedDropoff,
  rentalDays: initialRentalDays = 1,
  locations = [],
  isLoggedUser,
}: BookingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [rentalDays, setRentalDays] = useState(initialRentalDays);
  const [isUserVerified, setIsUserVerified] = useState(isLoggedUser);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Sync internal rentalDays state with prop changes
  useEffect(() => {
    setRentalDays(initialRentalDays);
  }, [initialRentalDays]);

  const bookingSchema = createBookingSchema(selectedPickup, selectedDropoff);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickupDate: new Date(),
      dropoffDate: addDays(new Date(), 1),
      pickupLocation: selectedPickup || "",
      dropoffLocation: selectedDropoff || "",
    },
  });

  const watchedPickupDate = form.watch("pickupDate");
  const watchedDropoffDate = form.watch("dropoffDate");

  React.useEffect(() => {
    if (watchedPickupDate && watchedDropoffDate) {
      const days = Math.max(
        1,
        differenceInDays(watchedDropoffDate, watchedPickupDate)
      );
      setRentalDays(days);
    }
  }, [watchedPickupDate, watchedDropoffDate]);

  const adjustDays = (increment: boolean) => {
    const currentDays = rentalDays;
    const newDays = increment ? currentDays + 1 : Math.max(1, currentDays - 1);
    const newDropoffDate = addDays(watchedPickupDate, newDays);
    form.setValue("dropoffDate", newDropoffDate);
    setRentalDays(newDays);
  };

  const getPricingBreakdown = () => {
    // Convert selected services to the format expected by pricing calculator
    const services: Service[] = selectedServices.map((serviceId) => {
      const serviceMap = {
        insurance: { name: t("insurance"), price: 50 },
        gps: { name: t("gps"), price: 25 },
        driver: { name: t("driver"), price: 200 },
        delivery: { name: t("delivery"), price: 75 },
      };

      const service = serviceMap[serviceId as keyof typeof serviceMap];
      return {
        id: serviceId,
        name: service?.name || serviceId,
        price: service?.price || 0,
        selected: true,
      };
    });

    // Use dynamic pricing calculator
    return calculateBookingPrice(rentalDays, car.pricing, services);
  };

  const calculateTotalPrice = () => {
    return getPricingBreakdown().totalPrice;
  };

  const getServiceDetails = () => {
    const serviceMap = {
      insurance: { name: t("insurance"), price: 50 },
      gps: { name: t("gps"), price: 25 },
      driver: { name: t("driver"), price: 200 },
      delivery: { name: t("delivery"), price: 75 },
    };

    return selectedServices.map((serviceId) => ({
      id: serviceId,
      name: serviceMap[serviceId as keyof typeof serviceMap]?.name || serviceId,
      price: serviceMap[serviceId as keyof typeof serviceMap]?.price || 0,
    }));
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newBookingId =
        "BKG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setBookingId(newBookingId);

      toast({
        title: t("paymentSuccessful"),
        description: t("bookingConfirmed"),
      });

      setShowInvoice(true);
    } catch (error) {
      toast({
        title: t("paymentFailed"),
        description: t("pleaseTryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showInvoice) {
    return (
      <BookingInvoice
        isOpen={isOpen}
        onClose={onClose}
        bookingId={bookingId}
        car={car}
        rentalDays={rentalDays}
        totalPrice={calculateTotalPrice()}
        pricingType={pricingType}
        selectedServices={selectedServices}
      />
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 ease-in-out mt-8 origin-top mx-auto${
        isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
      }`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 ">
        <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("completeBooking")}
        </h2>
        <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">
          {t("secureVehicleRental")}
        </p>
      </div>
      {!isUserVerified && (
        <CheckUserBeforeBooking
          onUserVerified={() => setIsUserVerified(true)}
          t={t}
        />
      )}
      <div className={`space-y-8 ${!isUserVerified ? "pointer-events-none animate-pulse duration-900 " : ""}`}>
        {/* Car Info Card */}
        <BookingCarInfo
          car={car}
          pricingType={pricingType}
          rentalDays={rentalDays}
          onAdjustDays={adjustDays}
          t={t}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Date & Location Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {t("pickupAndDropoff")}
                </h3>
              </div>

              <BookingDateLocationStep
                control={form.control}
                watchedPickupDate={watchedPickupDate}
                selectedPickup={selectedPickup}
                selectedDropoff={selectedDropoff}
                pickupLocations={locations.pickupLocations}
                dropoffLocations={locations.dropoffLocations}
              />

              <BookingServicesDisplay
                selectedServices={selectedServices}
                getServiceDetails={getServiceDetails}
              />
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl p-6 sm:p-8 text-white">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Shield className="h-6 w-6" />
                {t("priceSummary")}
              </h4>
              <div className="space-y-4">
                {(() => {
                  const pricingBreakdown = getPricingBreakdown();
                  return (
                    <>
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-blue-100">
                          {t("rentalDuration")} ({rentalDays}{" "}
                          {rentalDays === 1 ? t("day") : t("days")}):
                        </span>
                        <span className="font-semibold">
                          {t("currency")} {pricingBreakdown.basePrice}
                        </span>
                      </div>
                      {pricingBreakdown.servicesPrice > 0 && (
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-blue-100">
                            {t("additionalServices")}:
                          </span>
                          <span className="font-semibold">
                            {t("currency")} {pricingBreakdown.servicesPrice}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-blue-300 pt-4">
                        <div className="flex justify-between items-center text-2xl font-bold">
                          <span>{t("total")}:</span>
                          <span className="text-yellow-300">
                            {t("currency")} {pricingBreakdown.totalPrice}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mr-3" />
                    {t("processingPayment")}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-6 w-6 mr-3" />
                    {t("completePayment")}
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                🔒 {t("securePayment")}
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookingForm;
