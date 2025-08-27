
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface BookingPriceSummaryProps {
  car: {
    daily_rate: number;
  };
  rentalDays: number;
  getServiceDetails: () => Array<{ id: string; name: string; price: number }>;
  calculateTotalPrice: () => number;
}

const BookingPriceSummary = ({ 
  car, 
  rentalDays, 
  getServiceDetails, 
  calculateTotalPrice 
}: BookingPriceSummaryProps) => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const serviceDetails = getServiceDetails();
  const servicesTotal = serviceDetails.reduce((total, service) => total + service.price, 0);
  const basePrice = car.daily_rate * rentalDays;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 border-2 border-primary">
        <h4 className="text-lg sm:text-xl font-bold mb-4 text-primary">{t('priceSummary')}</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {t('basePrice')} ({rentalDays} {t('days')}):
            </span>
            <span className="font-semibold">{t('currency')} {basePrice}</span>
          </div>
          
          {serviceDetails.length > 0 && (
            <>
              <div className="space-y-2">
                <span className="text-gray-600 font-medium">{t('additionalServices')}:</span>
                {serviceDetails.map((service) => (
                  <div key={service.id} className="flex justify-between items-center text-sm px-2">
                    <span className="text-gray-500">• {service.name}</span>
                    <span>{t('currency')} {service.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('additionalServices')} {t('total')}:</span>
                <span className="font-semibold">{t('currency')} {servicesTotal}</span>
              </div>
            </>
          )}
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>{t('totalAmount')}:</span>
              <span className="text-primary">{t('currency')} {calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sign In / Sign Up Tabs */}
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t('signIn')}</TabsTrigger>
            <TabsTrigger value="signup">{t('signUp')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t('enterEmail')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                  placeholder={t('enterPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button className="w-full">
              {t('signIn')}
            </Button>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t('enterEmail')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                  placeholder={t('enterPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button className="w-full">
              {t('signUp')}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookingPriceSummary;
