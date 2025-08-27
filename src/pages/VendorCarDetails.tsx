import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const VendorCarDetails = () => {
  const { id } = useParams();

  // Fetch car details
  const { data: car, isLoading: carLoading } = useQuery({
    queryKey: ['vendor-car', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          branches (
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch related bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['car-bookings', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vendor:vendors(name)
        `)
        .eq('car_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (carLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading car details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Car not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/vendor-dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{car.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Image */}
            {car.images && car.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    {car.branches && (
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded">
                        {car.branches.name}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded font-semibold">
                      {car.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Car Information */}
            <Card>
              <CardHeader>
                <CardTitle>Car Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Brand & Model</h4>
                    <p className="text-gray-600">{car.brand} {car.model}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Year</h4>
                    <p className="text-gray-600">{car.year}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Type</h4>
                    <p className="text-gray-600">{car.type}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Fuel Type</h4>
                    <p className="text-gray-600">{car.fuel_type}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Transmission</h4>
                    <p className="text-gray-600">{car.transmission}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Seats</h4>
                    <p className="text-gray-600">{car.seats}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Related Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-4">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No bookings found for this car</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Pickup Date</TableHead>
                        <TableHead>Return Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking: any) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.booking_number}</TableCell>
                          <TableCell>{booking.customer_name}</TableCell>
                          <TableCell>{new Date(booking.pickup_date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(booking.return_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.booking_status}
                            </Badge>
                          </TableCell>
                          <TableCell>{booking.total_amount} SAR</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Daily Rate</div>
                  <div className="text-lg font-semibold text-primary">{car.daily_rate} SAR</div>
                </div>
                {car.weekly_rate && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Weekly Rate</div>
                    <div className="text-lg font-semibold text-primary">{car.weekly_rate} SAR</div>
                  </div>
                )}
                {car.monthly_rate && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Monthly Rate</div>
                    <div className="text-lg font-semibold text-primary">{car.monthly_rate} SAR</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <Badge variant={car.is_available ? "default" : "secondary"}>
                    {car.is_available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <Badge variant={car.is_featured ? "default" : "outline"}>
                    {car.is_featured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {car.deposit_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit:</span>
                    <span>{car.deposit_amount} SAR</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCarDetails;