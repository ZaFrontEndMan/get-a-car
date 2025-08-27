import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Car, Users, MapPin, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const VendorOverview = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['vendor-stats'],
    queryFn: async () => {
      console.log('Fetching vendor stats...');
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get vendor record for current user
        const { data: vendor, error: vendorError } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (vendorError) {
          console.error('Error fetching vendor:', vendorError);
          throw vendorError;
        }

        if (!vendor) {
          throw new Error('No vendor record found for current user');
        }

        console.log('Found vendor:', vendor.id);

        // Get cars count for this vendor only
        const { count: carsCount, error: carsError } = await supabase
          .from('cars')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendor.id);

        if (carsError) {
          console.error('Cars query error:', carsError);
          throw carsError;
        }

        // Get branches count for this vendor only
        const { count: branchesCount, error: branchesError } = await supabase
          .from('branches')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendor.id);

        if (branchesError) {
          console.error('Branches query error:', branchesError);
          throw branchesError;
        }

        // Get bookings count for this vendor only
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendor.id);

        if (bookingsError) {
          console.error('Bookings query error:', bookingsError);
          throw bookingsError;
        }

        // Get active bookings count for this vendor only
        const { count: activeBookingsCount, error: activeBookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendor.id)
          .eq('booking_status', 'active');

        if (activeBookingsError) {
          console.error('Active bookings query error:', activeBookingsError);
          throw activeBookingsError;
        }

        const statsData = {
          totalCars: carsCount || 0,
          totalBranches: branchesCount || 0,
          totalBookings: bookingsCount || 0,
          activeBookings: activeBookingsCount || 0
        };

        console.log('Stats fetched successfully:', statsData);
        return statsData;
      } catch (error) {
        console.error('Error in stats query:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds to reduce load
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Cars',
      value: stats?.totalCars || 0,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Branches',
      value: stats?.totalBranches || 0,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Bookings',
      value: stats?.activeBookings || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {stats?.totalCars === 0 && stats?.totalBranches === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Welcome to your vendor dashboard! Start by adding your first car and setting up branches to begin managing your rental business.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorOverview;
