
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, User, CreditCard, Shield } from 'lucide-react';
import { differenceInDays, addDays } from 'date-fns';
import { createBookingSchema, BookingFormData } from './booking/bookingSchema';
import BookingInvoice from './booking/BookingInvoice';
import BookingCarInfo from './booking/BookingCarInfo';
import BookingDateLocationStep from './booking/BookingDateLocationStep';
import BookingDriverStep from './booking/BookingDriverStep';
import BookingPaymentStep from './booking/BookingPaymentStep';
import BookingServicesDisplay from './booking/BookingServicesDisplay';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
  totalPrice: number;
  selectedServices: string[];
  pricingType: string;
  selectedPickup?: string;
  selectedDropoff?: string;
}

const BookingForm = ({ 
  isOpen, 
  onClose, 
  car, 
  totalPrice, 
  selectedServices, 
  pricingType,
  selectedPickup,
  selectedDropoff
}: BookingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [rentalDays, setRentalDays] = useState(1);
  const { toast } = useToast();
  const { t } = useLanguage();

  const bookingSchema = createBookingSchema(selectedPickup, selectedDropoff);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      needsDriver: false,
      pickupDate: new Date(),
      dropoffDate: addDays(new Date(), 1),
      pickupLocation: selectedPickup || '',
      dropoffLocation: selectedDropoff || '',
    }
  });

  const watchedPickupDate = form.watch('pickupDate');
  const watchedDropoffDate = form.watch('dropoffDate');
  const needsDriver = form.watch('needsDriver');

  React.useEffect(() => {
    if (watchedPickupDate && watchedDropoffDate) {
      const days = Math.max(1, differenceInDays(watchedDropoffDate, watchedPickupDate));
      setRentalDays(days);
    }
  }, [watchedPickupDate, watchedDropoffDate]);

  const adjustDays = (increment: boolean) => {
    const currentDays = rentalDays;
    const newDays = increment ? currentDays + 1 : Math.max(1, currentDays - 1);
    const newDropoffDate = addDays(watchedPickupDate, newDays);
    form.setValue('dropoffDate', newDropoffDate);
    setRentalDays(newDays);
  };

  const calculateTotalPrice = () => {
    const basePrice = car.pricing[pricingType] * rentalDays;
    const servicesPrice = selectedServices.reduce((total, serviceId) => {
      const service = [
        { id: 'insurance', price: 50 },
        { id: 'gps', price: 25 },
        { id: 'driver', price: 200 },
        { id: 'delivery', price: 75 }
      ].find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    return basePrice + servicesPrice;
  };

  const getServiceDetails = () => {
    const serviceMap = {
      insurance: { name: t('insurance'), price: 50 },
      gps: { name: t('gps'), price: 25 },
      driver: { name: t('driver'), price: 200 },
      delivery: { name: t('delivery'), price: 75 }
    };
    
    return selectedServices.map(serviceId => ({
      id: serviceId,
      name: serviceMap[serviceId as keyof typeof serviceMap]?.name || serviceId,
      price: serviceMap[serviceId as keyof typeof serviceMap]?.price || 0
    }));
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newBookingId = 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setBookingId(newBookingId);
      
      toast({
        title: t('paymentSuccessful'),
        description: t('bookingConfirmed'),
      });
      
      setShowInvoice(true);
    } catch (error) {
      toast({
        title: t('paymentFailed'),
        description: t('pleaseTryAgain'),
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 sm:p-8 sticky top-0 z-10">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('completeBooking')}
            </DialogTitle>
            <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">
              {t('secureVehicleRental')}
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Car Info Card */}
          <BookingCarInfo 
            car={car}
            pricingType={pricingType}
            rentalDays={rentalDays}
            onAdjustDays={adjustDays}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Date & Location Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-full p-3">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{t('pickupAndDropoff')}</h3>
                    {(selectedPickup || selectedDropoff) && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {t('locationsPreSelected')}
                      </p>
                    )}
                  </div>
                </div>

                <BookingDateLocationStep 
                  control={form.control}
                  watchedPickupDate={watchedPickupDate}
                />

                <BookingServicesDisplay 
                  selectedServices={selectedServices}
                  getServiceDetails={getServiceDetails}
                />
              </div>

              {/* Driver Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full p-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{t('driverOption')}</h3>
                  </div>
                </div>

                <BookingDriverStep 
                  control={form.control}
                  needsDriver={needsDriver}
                />
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-full p-3">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{t('paymentInformation')}</h3>
                  </div>
                </div>

                <BookingPaymentStep 
                  control={form.control}
                  car={car}
                  pricingType={pricingType}
                  rentalDays={rentalDays}
                  selectedServices={selectedServices}
                />
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl p-6 sm:p-8 text-white">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6" />
                  {t('priceSummary')}
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-blue-100">{t('basePrice')} ({rentalDays} {t('days')}):</span>
                    <span className="font-semibold">{t('currency')} {car.pricing[pricingType] * rentalDays}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-blue-100">{t('additionalServices')}:</span>
                    <span className="font-semibold">{t('currency')} {calculateTotalPrice() - (car.pricing[pricingType] * rentalDays)}</span>
                  </div>
                  <div className="border-t border-blue-300 pt-4">
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>{t('total')}:</span>
                      <span className="text-yellow-300">{t('currency')} {calculateTotalPrice()}</span>
                    </div>
                  </div>
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
                      {t('processingPayment')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6 mr-3" />
                      {t('completePayment')}
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  🔒 {t('securePayment')}
                </p>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
