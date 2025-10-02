
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VendorBookingTableViewProps {
  bookings: any[];
  onAcceptBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onStartProgress: (id: string) => void;
  onAcceptReturn: (id: string) => void;
  isAcceptLoading: boolean;
  isRejectLoading: boolean;
  isStartLoading: boolean;
  isReturnLoading: boolean;
}

const VendorBookingTableView = ({
  bookings,
  onAcceptBooking,
  onRejectBooking,
  onStartProgress,
  onAcceptReturn,
  isAcceptLoading,
  isRejectLoading,
  isStartLoading,
  isReturnLoading,
}: VendorBookingTableViewProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'return_requested': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': t('pending'),
      'confirmed': t('confirmed'),
      'active': t('active'),
      'in_progress': t('inProgress'),
      'return_requested': 'طلب إرجاع',
      'completed': t('completed'),
      'cancelled': t('cancelled')
    };
    return statusMap[status] || status;
  };

  const getActionButtons = (booking: any) => {
    const status = booking.booking_status;
    
    switch (status) {
      case 'pending':
        return (
          <div className={`flex gap-1 ${isRTL ? 'gap-reverse' : ''}`}>
            <Button
              onClick={() => onAcceptBooking(booking.id)}
              disabled={isAcceptLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 px-2 py-1 text-xs"
            >
              {t('approved')}
            </Button>
            <Button
              onClick={() => onRejectBooking(booking.id)}
              disabled={isRejectLoading}
              variant="destructive"
              size="sm"
              className="px-2 py-1 text-xs"
            >
              {t('rejected')}
            </Button>
          </div>
        );
      case 'active':
        return (
          <Button
            onClick={() => onStartProgress(booking.id)}
            disabled={isStartLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 text-xs"
          >
            {language === 'ar' ? 'بدء' : 'Start'}
          </Button>
        );
      case 'return_requested':
        return (
          <Button
            onClick={() => onAcceptReturn(booking.id)}
            disabled={isReturnLoading}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 px-2 py-1 text-xs"
          >
            {language === 'ar' ? 'قبول الإرجاع' : 'Accept Return'}
          </Button>
        );
      default:
        return (
          <span className="text-xs text-gray-500">
            {language === 'ar' ? 'لا توجد إجراءات' : 'No actions'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`w-24 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('bookingNumber')}
              </TableHead>
              <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                {t('customer')}
              </TableHead>
              <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                {t('vehicle')}
              </TableHead>
              <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                {t('pickupDateShort')}
              </TableHead>
              <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                {t('returnDateShort')}
              </TableHead>
              <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                {t('amount')}
              </TableHead>
              <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                {t('status')}
              </TableHead>
              <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                {t('actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-xs">
                  #{booking.booking_number}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{booking.customer_name}</div>
                    <div className="text-xs text-gray-500">{booking.customer_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{booking.cars?.[0]?.name}</div>
                    <div className="text-xs text-gray-500">{booking.cars?.[0]?.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(booking.pickup_date).toLocaleDateString(isRTL ? 'ar' : 'en')}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(booking.return_date).toLocaleDateString(isRTL ? 'ar' : 'en')}
                </TableCell>
                <TableCell className="font-medium">
                  {t('currency')} {booking.total_amount}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.booking_status)}>
                    {getStatusText(booking.booking_status)}
                  </Badge>
                </TableCell>
                <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                  {getActionButtons(booking)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorBookingTableView;
