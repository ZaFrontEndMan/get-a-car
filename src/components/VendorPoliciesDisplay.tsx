
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText } from 'lucide-react';

interface VendorPoliciesDisplayProps {
  vendorId: string;
  showTitle?: boolean;
  maxPolicies?: number;
  policyTypes?: string[];
}

const VendorPoliciesDisplay = ({ 
  vendorId, 
  showTitle = true, 
  maxPolicies,
  policyTypes 
}: VendorPoliciesDisplayProps) => {
  const { t, language } = useLanguage();

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['vendor-policies-display', vendorId, policyTypes],
    queryFn: async () => {
      let query = supabase
        .from('vendor_policies')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (policyTypes && policyTypes.length > 0) {
        query = query.in('policy_type', policyTypes);
      }

      if (maxPolicies) {
        query = query.limit(maxPolicies);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!policies || policies.length === 0) {
    return null;
  }

  const getPolicyTypeLabel = (type: string) => {
    const labels = {
      general: language === 'ar' ? 'عام' : 'General',
      booking: language === 'ar' ? 'الحجز' : 'Booking',
      cancellation: language === 'ar' ? 'الإلغاء' : 'Cancellation',
      payment: language === 'ar' ? 'الدفع' : 'Payment',
      insurance: language === 'ar' ? 'التأمين' : 'Insurance',
      fuel: language === 'ar' ? 'الوقود' : 'Fuel',
      damage: language === 'ar' ? 'الأضرار' : 'Damage'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'سياسات التأجير' : 'Rental Policies'}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? '' : 'p-6'}>
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="border-l-4 border-primary pl-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {language === 'ar' && policy.title_ar ? policy.title_ar : policy.title_en}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {getPolicyTypeLabel(policy.policy_type)}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {language === 'ar' && policy.description_ar ? policy.description_ar : policy.description_en}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorPoliciesDisplay;
