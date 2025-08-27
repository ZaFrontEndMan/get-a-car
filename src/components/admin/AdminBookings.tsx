
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Car, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStatusConfig } from '@/components/vendor/bookings/bookingUtils';

const AdminBookings = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars(name, brand, model),
          vendors(name, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.booking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.cars?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold">{t('bookingsManagement')}</h2>
          <p className="text-gray-600">{t('monitorAllBookings')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {t('totalBookings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {t('activeBookings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => ['confirmed', 'active', 'in_progress'].includes(b.booking_status)).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.booking_status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('cancelled')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.booking_status === 'cancelled').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('bookings')}</CardTitle>
          <CardDescription>
            {t('monitorAllBookings')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center space-x-2 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchBookings')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('bookingInfo')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('customer')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('vehicle')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('pickupDate')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('returnDate')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('amount')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('status')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.booking_status);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {booking.booking_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.vendors?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {booking.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customer_phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {booking.cars?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.cars?.brand} {booking.cars?.model}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(booking.pickup_date).toLocaleDateString(isRTL ? 'ar' : 'en')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(booking.return_date).toLocaleDateString(isRTL ? 'ar' : 'en')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {t('currency')} {booking.total_amount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border ${statusConfig.color}`}>
                          {t(booking.booking_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                          <Button variant="outline" size="sm">
                            {t('view')}
                          </Button>
                          <Button variant="outline" size="sm">
                            {t('edit')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
