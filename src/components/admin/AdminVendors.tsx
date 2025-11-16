
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Building2, Car, Star, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import LazyImage from '../ui/LazyImage';

const AdminVendors = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          *,
          cars(count),
          branches(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('vendorsManagement')}</h2>
          <p className="text-gray-600">{t('manageCarRentalVendors')}</p>
        </div>
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          {t('addVendor')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              {t('totalVendors')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Car className="h-4 w-4 mr-2" />
              {t('totalCars')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.reduce((sum, vendor) => sum + (vendor.cars?.[0]?.count || 0), 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('verifiedVendors')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.verified).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-2" />
              {t('avgRating')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.length > 0 ? 
                (vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / vendors.length).toFixed(1) : 
                '0.0'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('vendors')}</CardTitle>
          <CardDescription>
            {t('manageCarRentalVendors')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'gap-reverse' : ''}`}>
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchVendors')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('vendorInfo')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('contact')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('fleet')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('rating')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('status')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('joined')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className={`flex items-center gap-3 ${isRTL ? 'gap-reverse' : ''}`}>
                        {vendor.logo_url ? (
                          <LazyImage
                            src={vendor.logo_url}
                            alt={vendor.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className={`text-sm text-gray-500 flex items-center ${isRTL ? 'gap-reverse' : ''}`}>
                            <MapPin className="h-3 w-3 mr-1" />
                            {vendor.location || t('noLocation')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{vendor.email}</div>
                        <div className="text-sm text-gray-600">{vendor.phone || t('noPhone')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`flex items-center text-sm ${isRTL ? 'gap-reverse' : ''}`}>
                          <Car className="h-3 w-3 mr-1" />
                          {vendor.cars?.[0]?.count || 0} {t('cars')}
                        </div>
                        <div className={`flex items-center text-sm text-gray-600 ${isRTL ? 'gap-reverse' : ''}`}>
                          <Building2 className="h-3 w-3 mr-1" />
                          {vendor.branches?.[0]?.count || 0} {t('branches')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${isRTL ? 'gap-reverse' : ''}`}>
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{vendor.rating || '0.0'}</span>
                        <span className="text-sm text-gray-500">
                          ({vendor.total_reviews || 0})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Badge variant={vendor.verified ? "default" : "secondary"}>
                          {vendor.verified ? t('verified') : t('unverified')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(vendor.created_at).toLocaleDateString(isRTL ? 'ar' : 'en')}
                    </TableCell>
                    <TableCell>
                      <div className={`flex gap-2 ${isRTL ? 'gap-reverse' : ''}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                        >
                          {t('viewDetails')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVendors;
