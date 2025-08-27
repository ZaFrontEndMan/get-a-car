
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminAccessGuard from '@/components/admin/AdminAccessGuard';
import { useVendorDetails } from '@/components/admin/vendor-details/useVendorDetails';
import { useLanguage } from '@/contexts/LanguageContext';
import VendorDetailsHeader from '@/components/admin/vendor-details/VendorDetailsHeader';
import { VendorInfoCard } from '@/components/admin/vendor-details/VendorInfoCard';
import { AdminControlsCard } from '@/components/admin/vendor-details/AdminControlsCard';
import { VendorCarsTable } from '@/components/admin/vendor-details/VendorCarsTable';
import { VendorBookingsTable } from '@/components/admin/vendor-details/VendorBookingsTable';
import { VendorBranchesTable } from '@/components/admin/vendor-details/VendorBranchesTable';

const AdminVendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const { vendor, cars, branches, bookings, loading, handleSwitchChange } = useVendorDetails(id);

  if (loading) {
    return (
      <AdminAccessGuard>
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">{t('loadingData')}</div>
            </div>
          </div>
        </div>
      </AdminAccessGuard>
    );
  }

  if (!vendor) {
    return (
      <AdminAccessGuard>
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-500">{t('noDataAvailable')}</div>
            </div>
          </div>
        </div>
      </AdminAccessGuard>
    );
  }

  return (
    <AdminAccessGuard>
      <div className="min-h-screen bg-gray-50">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="space-y-6">
            <VendorDetailsHeader
              vendor={vendor}
              carsCount={cars.length}
              branchesCount={branches.length}
              onBackClick={() => navigate('/admin')}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <VendorInfoCard 
                  vendor={vendor} 
                  carsCount={cars.length} 
                  branchesCount={branches.length} 
                />
              </div>
              
              <div className="xl:col-span-1">
                <AdminControlsCard 
                  vendor={vendor} 
                  onSwitchChange={handleSwitchChange} 
                />
              </div>
            </div>

            <Tabs defaultValue="cars" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
              <TabsList className={`grid w-full grid-cols-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TabsTrigger value="cars">
                  {t('cars')} ({cars.length})
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  {t('bookings')} ({bookings.length})
                </TabsTrigger>
                <TabsTrigger value="branches">
                  {t('branches')} ({branches.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cars" className="space-y-4">
                <VendorCarsTable cars={cars} />
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                <VendorBookingsTable bookings={bookings} />
              </TabsContent>

              <TabsContent value="branches" className="space-y-4">
                <VendorBranchesTable branches={branches} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminAccessGuard>
  );
};

export default AdminVendorDetails;
