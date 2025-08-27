
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import { Control } from 'react-hook-form';
import { BookingFormData } from './bookingSchema';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingPaymentStepProps {
  control: Control<BookingFormData>;
  car: any;
  pricingType: string;
  rentalDays: number;
  selectedServices: string[];
}

const BookingPaymentStep = ({ control, car, pricingType, rentalDays, selectedServices }: BookingPaymentStepProps) => {
  const { t } = useLanguage();

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

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 justify-center sm:justify-start">
        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>{t('paymentInformation')}</span>
      </h3>

      <div className="space-y-4">
        <FormField
          control={control}
          name="cardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{t('cardType')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={t('selectCardType')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="visa">{t('visa')}</SelectItem>
                  <SelectItem value="mastercard">{t('mastercard')}</SelectItem>
                  <SelectItem value="mada">{t('mada')}</SelectItem>
                  <SelectItem value="amex">{t('amex')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{t('cardNumber')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="1234 5678 9012 3456" 
                    {...field} 
                    className="h-10"
                    maxLength={16}
                    onChange={(e) => {
                      // Only allow digits and limit to 16 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cardholderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{t('cardholderName')}</FormLabel>
                <FormControl>
                  <Input placeholder="Hafez Rahim" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{t('expiryDate')}</FormLabel>
                <FormControl>
                  <Input placeholder="MM/YY" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{t('cvv')}</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-sm sm:text-base">{t('priceSummary')}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{t('basePrice')} ({rentalDays} {t('days')}):</span>
              <span>{t('currency')} {car.pricing[pricingType] * rentalDays}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('additionalServices')}:</span>
              <span>{t('currency')} {calculateTotalPrice() - (car.pricing[pricingType] * rentalDays)}</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
              <span>{t('total')}:</span>
              <span>{t('currency')} {calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentStep;
