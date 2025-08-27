
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Car, Clock } from 'lucide-react';

interface Booking {
  id: string;
  booking_number: string;
  car_id: string;
  pickup_date: string;
  return_date: string;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
  cars: {
    name: string;
    brand: string;
    model: string;
  } | null;
  vendors: {
    name: string;
  } | null;
}

interface ClientBookingsCardProps {
  bookings: Booking[];
}

const ClientBookingsCard: React.FC<ClientBookingsCardProps> = ({ bookings }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'pending':
      case 'in_progress':
      case 'return_requested':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="flex items-center text-lg">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Booking History ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 mb-2">No bookings found</div>
            <div className="text-sm text-gray-400">
              Bookings will appear here once this client makes their first reservation
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile view - Card layout */}
            <div className="block sm:hidden">
              <div className="space-y-3 p-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">
                        {booking.booking_number || `#${booking.id.slice(0, 8)}`}
                      </div>
                      <Badge variant={getStatusVariant(booking.booking_status || 'pending')} className="text-xs">
                        {booking.booking_status || 'pending'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Car className="h-3 w-3 mr-1" />
                        {booking.cars?.name || 'Unknown Car'}
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-600">
                          SAR {booking.total_amount?.toLocaleString() || '0'}
                        </span>
                        <Badge variant={getStatusVariant(booking.payment_status || 'pending')} className="text-xs">
                          {booking.payment_status || 'pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop/Tablet view - Table layout */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Booking #</TableHead>
                    <TableHead className="font-semibold">Car</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Dates</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-sm">
                          {booking.booking_number || `#${booking.id.slice(0, 8)}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {booking.cars?.name || 'Unknown Car'}
                          </div>
                          {booking.cars && (
                            <div className="text-xs text-gray-500">
                              {booking.cars.brand} {booking.cars.model}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {booking.vendors?.name || 'Unknown Vendor'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(booking.pickup_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(booking.return_date).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          SAR {booking.total_amount?.toLocaleString() || '0'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.booking_status || 'pending')} className="text-xs">
                          {booking.booking_status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.payment_status || 'pending')} className="text-xs">
                          {booking.payment_status || 'pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBookingsCard;
