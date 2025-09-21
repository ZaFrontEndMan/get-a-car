
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '../../contexts/LanguageContext';
import VendorPoliciesDisplay from '../VendorPoliciesDisplay';

interface CarDetailsVendorInfoProps {
  car: any;
}

const CarDetailsVendorInfo = ({ car }: CarDetailsVendorInfoProps) => {
  const { t, language } = useLanguage();

  // Fetch real cars count for the vendor
  const { data: realCarsCount } = useQuery({
    queryKey: ['vendor-cars-count', car.vendor_id],
    queryFn: async () => {
      if (!car.vendor_id) return 0;
      const { count } = await supabase
        .from('cars')
        .select('id', { count: 'exact' })
        .eq('vendor_id', car.vendor_id);
      return count || 0;
    },
    enabled: !!car.vendor_id
  });

  const displayCarsCount = realCarsCount || 0;

  return (
    <div className="space-y-6">
      {/* Vendor Information */}
      {car.vendors && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {language === 'ar' ? 'معلومات المورد' : 'Vendor Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {car.vendors.name?.charAt(0) || 'V'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{car.vendors.name || 'Unknown Vendor'}</h4>
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    4.8
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">4.8</div>
                    <div className="text-gray-600">
                      {language === 'ar' ? 'التقييم' : 'Rating'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{displayCarsCount}</div>
                    <div className="text-gray-600">
                      {language === 'ar' ? 'السيارات' : 'Cars'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">100%</div>
                    <div className="text-gray-600">
                      {language === 'ar' ? 'الاستجابة' : 'Response'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendor Policies */}
      {car.vendor_id && (
        <VendorPoliciesDisplay 
          vendorId={car.vendor_id} 
          maxPolicies={8}
          policyTypes={['booking', 'cancellation', 'payment', 'fuel', 'general']}
        />
      )}
    </div>
  );
};

export default CarDetailsVendorInfo;
