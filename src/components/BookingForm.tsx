import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MapPin, CreditCard, Shield, X } from "lucide-react";
import { differenceInDays, addDays } from "date-fns";
import { createBookingSchema, BookingFormData } from "./booking/bookingSchema";
import BookingInvoice from "./booking/BookingInvoice";
import BookingCarInfo from "./booking/BookingCarInfo";
import BookingDateLocationStep from "./booking/BookingDateLocationStep";
import BookingServicesDisplay from "./booking/BookingServicesDisplay";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateBookingPrice, Service } from "../utils/pricingCalculator";
import CheckUserBeforeBooking from "./CheckUserBeforeBooking";
import { useClientBookings } from "@/hooks/client/useClientBookings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

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
  const [paymentUrl, setPaymentUrl] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  const { useCreateBookingMutation, usePaymentCallbackMutation } =
    useClientBookings();

  const createBookingMutation = useCreateBookingMutation();
  const paymentCallbackMutation = usePaymentCallbackMutation();

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

    return calculateBookingPrice(rentalDays, car.pricing, services);
  };

  const calculateTotalPrice = () => {
    return getPricingBreakdown().totalPrice;
  };

  const getServiceDetails = () => {
    const serviceMap = {
      insurance: { name: t("insurance"), price: 50, id: 19 },
      gps: { name: t("gps"), price: 25, id: 20 },
      driver: { name: t("driver"), price: 200, id: 21 },
      delivery: { name: t("delivery"), price: 75, id: 22 },
    };

    return selectedServices.map((serviceId) => ({
      id: serviceId,
      name: serviceMap[serviceId as keyof typeof serviceMap]?.name || serviceId,
      price: serviceMap[serviceId as keyof typeof serviceMap]?.price || 0,
      serviceId: serviceMap[serviceId as keyof typeof serviceMap]?.id || 0,
    }));
  };

  const onSubmit = async (data: BookingFormData) => {
    console.log("Form submitted with data:", data); // Debug log
    setIsLoading(true);
    try {
      const bookingData = {
        carId: parseInt(car.id),
        fromDate: data.pickupDate.toISOString(),
        toDate: data.dropoffDate.toISOString(),
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        offerId: 0,
        services: getServiceDetails().map((service) => service.serviceId),
        protection: [],
      };

      console.log("Sending booking data:", bookingData); // Debug log
      const response = await createBookingMutation.mutateAsync(bookingData);
      console.log("Booking response:", response); // Debug log

      const newBookingId =
        response.bookingId ||
        "BKG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setBookingId(newBookingId);

      if (response.data) {
        setPaymentUrl(response.data);
        // await paymentCallbackMutation.mutateAsync(response.data);
        console.log("Payment callback triggered for URL:", response.data); // Debug log
      }

      toast({
        title: t("paymentInitiated"),
        description: t("redirectingToPayment"),
      });
    } catch (error) {
      console.error("Booking error:", error); // Debug log
      toast({
        title: t("bookingFailed"),
        description: error?.response?.data?.customMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentUrl) {
    return (
      <Dialog open={true} onOpenChange={() => setPaymentUrl("")}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("completePayment")}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <iframe
            src={`https://accept.paymob.com/api/acceptance/iframes/877416?payment_token=${paymentUrl}`}
            title="Payment Gateway"
            className="w-full h-[500px] border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </DialogContent>
      </Dialog>
    );
  }

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
      <div className="border-b border-gray-200 pb-4">
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
        />
      )}
      <div
        className={`space-y-8 ${
          !isUserVerified
            ? "pointer-events-none animate-pulse duration-900"
            : ""
        }`}
      >
        <BookingCarInfo
          car={car}
          pricingType={pricingType}
          rentalDays={rentalDays}
          onAdjustDays={adjustDays}
          t={t}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                formattedPricing={getPricingBreakdown()}
                selectedServices={selectedServices}
                getServiceDetails={getServiceDetails}
              />
            </div>

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

            <div className="pt-6">
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  createBookingMutation.isLoading ||
                  !isUserVerified
                }
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl"
              >
                {isLoading || createBookingMutation.isLoading ? (
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
