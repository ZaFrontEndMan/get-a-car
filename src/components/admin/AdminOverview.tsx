
import React from 'react';
import { Users, Calendar, CreditCard, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminOverview = () => {
  // Fetch real stats data
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, bookingsResult, vendorsResult, revenueResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id, booking_status', { count: 'exact' }),
        supabase.from('vendors').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('total_amount')
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0) || 0;
      const activeBookings = bookingsResult.data?.filter(b => ['pending', 'confirmed', 'active', 'in_progress'].includes(b.booking_status)).length || 0;

      return {
        totalUsers: usersResult.count || 0,
        activeBookings,
        totalRevenue,
        totalVendors: vendorsResult.count || 0
      };
    }
  });

  // Fetch recent bookings
  const { data: recentBookings } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_number,
          total_amount,
          booking_status,
          cars(name, brand)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch top vendors
  const { data: topVendors } = useQuery({
    queryKey: ['top-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          id,
          name,
          cars(id),
          bookings:cars(bookings(total_amount))
        `)
        .limit(5);
      
      if (error) throw error;
      
      // Calculate revenue for each vendor
      return data?.map(vendor => ({
        ...vendor,
        carCount: vendor.cars?.length || 0,
        revenue: vendor.bookings?.reduce((sum: number, car: any) => 
          sum + (car.bookings?.reduce((carSum: number, booking: any) => 
            carSum + Number(booking.total_amount || 0), 0) || 0), 0) || 0
      })).sort((a, b) => b.revenue - a.revenue) || [];
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeBookings?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">Currently active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {stats?.totalRevenue?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">Total platform revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVendors?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">Registered vendors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest car rental bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings?.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{booking.booking_number}</p>
                    <p className="text-sm text-gray-600">{booking.cars?.brand} {booking.cars?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">SAR {Number(booking.total_amount).toLocaleString()}</p>
                    <p className="text-sm text-gray-600 capitalize">{booking.booking_status}</p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500">No recent bookings</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Highest performing vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVendors?.slice(0, 3).map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-gray-600">{vendor.carCount} cars</p>
                  </div>
                   <div className="text-right">
                     <p className="font-medium">SAR {(vendor.revenue || 0).toLocaleString()}</p>
                     <p className="text-sm text-gray-600">Total revenue</p>
                   </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500">No vendor data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
