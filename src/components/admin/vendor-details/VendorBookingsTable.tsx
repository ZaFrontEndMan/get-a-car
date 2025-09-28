
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Booking } from './types';
import { formatDate } from '@/lib/utils';

interface VendorBookingsTableProps {
  bookings: Booking[];
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'confirmed':
    case 'completed':
    case 'paid':
      return 'default';
    case 'cancelled':
    case 'failed':
      return 'destructive';
    case 'pending':
    case 'in_progress':
    case 'return_requested':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const VendorBookingsTable: React.FC<VendorBookingsTableProps> = ({ bookings }) => {
  console.log('VendorBookingsTable - Received bookings:', bookings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
        <CardDescription>
          All bookings for this vendor's cars ({bookings.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">No bookings found for this vendor</div>
            <div className="text-sm text-gray-400">
              Bookings will appear here once customers start renting this vendor's cars
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Booking #</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[150px]">Car</TableHead>
                  <TableHead className="min-w-[120px]">Pickup Date</TableHead>
                  <TableHead className="min-w-[120px]">Return Date</TableHead>
                  <TableHead className="min-w-[100px]">Days</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Payment</TableHead>
                  <TableHead className="min-w-[120px]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(booking => (
                  <TableRow key={booking?.id}>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {booking?.booking_number || `#${booking?.id.slice(0, 8)}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {booking?.customer_name || 'Unknown Customer'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking?.customer_email}
                        </div>
                        {booking?.customer_phone && (
                          <div className="text-xs text-gray-500">
                            {booking?.customer_phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {booking?.cars?.name || 'Unknown Car'}
                        </div>
                        {booking?.cars && (
                          <div className="text-xs text-gray-500">
                            {booking?.cars?.brand} {booking?.cars?.model}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(booking?.pickup_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(booking?.return_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {booking?.total_days || 1} day{(booking?.total_days || 1) !== 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">
                        SAR {booking?.total_amount?.toLocaleString() || '0'}
                      </div>
                      {booking?.daily_rate && (
                        <div className="text-xs text-gray-500">
                          SAR {booking?.daily_rate}/day
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(booking?.booking_status || 'pending')} className="text-xs">
                        {booking?.booking_status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(booking?.payment_status || 'pending')} className="text-xs">
                        {booking?.payment_status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking?.created_at)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
