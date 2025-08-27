import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Car } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingStatusFilter from './bookings/BookingStatusFilter';
import VendorBookingViewToggle from './bookings/VendorBookingViewToggle';
import VendorBookingGridView from './bookings/VendorBookingGridView';
import VendorBookingListView from './bookings/VendorBookingListView';
import VendorBookingTableView from './bookings/VendorBookingTableView';
import EmptyBookingsState from './bookings/EmptyBookingsState';

type BookingStatus = 'pending' | 'confirmed' | 'active' | 'in_progress' | 'return_requested' | 'completed' | 'cancelled';

const VendorBookings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  // Set default view mode based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('table');
      } else if (window.innerWidth < 1024) {
        setViewMode('list');
      } else {
        setViewMode('grid');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log('VendorBookings - Current user:', user?.id);

  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['vendor-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID found');
        return [];
      }
      
      console.log('Fetching bookings for user:', user.id);
      
      // First, get the vendor record for this user
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendorError) {
        console.error('Error fetching vendor:', vendorError);
        throw vendorError;
      }

      if (!vendorData) {
        console.log('No vendor found for user:', user.id);
        return [];
      }

      console.log('Found vendor:', vendorData.id);
      
      // Now fetch bookings for this vendor
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars (
            id,
            name,
            brand,
            model,
            images,
            daily_rate
          )
        `)
        .eq('vendor_id', vendorData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      console.log('Fetched vendor bookings:', data);
      
      // Log each booking's status
      data?.forEach(booking => {
        console.log(`Booking ${booking.id}: status = ${booking.booking_status}`);
      });
      
      return data || [];
    },
    enabled: !!user?.id,
    refetchInterval: 3000, // Reduced to 3 seconds for faster updates
    refetchIntervalInBackground: true,
  });

  // Set up real-time subscription for booking updates with better error handling
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up enhanced real-time subscription for vendor bookings');
    
    const channel = supabase
      .channel('vendor-bookings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Real-time booking change detected:', payload);
          console.log('Payload event:', payload.eventType);
          console.log('Payload new record:', payload.new);
          console.log('Payload old record:', payload.old);
          
          // Force immediate refetch of bookings
          queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
          refetch();
          
          // Show notification for return requests
          if (payload.eventType === 'UPDATE' && payload.new?.booking_status === 'return_requested') {
            toast.info('New return request received!');
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up enhanced real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient, refetch]);

  const acceptBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: 'active' })
        .eq('id', bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
      toast.success('Booking accepted successfully');
    },
    onError: (error) => {
      console.error('Error accepting booking:', error);
      toast.error('Failed to accept booking');
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
      toast.success('Booking rejected successfully');
    },
    onError: (error) => {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
    },
  });

  const startProgressMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: 'in_progress' })
        .eq('id', bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
      toast.success('Booking started successfully');
    },
    onError: (error) => {
      console.error('Error starting booking:', error);
      toast.error('Failed to start booking');
    },
  });

  const acceptReturnMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      console.log('Accepting return for booking:', bookingId);
      const { error } = await supabase.rpc('accept_car_return', {
        booking_id_param: bookingId
      });

      if (error) {
        console.error('Accept return error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] }); // Also invalidate client bookings
      toast.success('Return accepted successfully');
    },
    onError: (error) => {
      console.error('Error accepting return:', error);
      toast.error('Failed to accept return');
    },
  });

  // Force refetch when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      console.log('Force refetching bookings due to user change');
      refetch();
    }
  }, [user?.id, refetch]);

  const filteredBookings = bookings?.filter(booking => 
    statusFilter === 'all' || booking.booking_status === statusFilter
  ) || [];

  console.log('VendorBookings - Filtered bookings:', filteredBookings.length);
  console.log('VendorBookings - Status filter:', statusFilter);

  const getStatusCounts = () => {
    if (!bookings) return {};
    
    const counts = bookings.reduce((acc, booking) => {
      const status = booking.booking_status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    console.error('Bookings query error:', error);
    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bookings</h3>
        <p className="text-gray-500">Please try refreshing the page</p>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderBookingsContent = () => {
    const commonProps = {
      bookings: filteredBookings,
      onAcceptBooking: acceptBookingMutation.mutate,
      onRejectBooking: rejectBookingMutation.mutate,
      onStartProgress: startProgressMutation.mutate,
      onAcceptReturn: acceptReturnMutation.mutate,
      isAcceptLoading: acceptBookingMutation.isPending,
      isRejectLoading: rejectBookingMutation.isPending,
      isStartLoading: startProgressMutation.isPending,
      isReturnLoading: acceptReturnMutation.isPending,
    };

    switch (viewMode) {
      case 'grid':
        return <VendorBookingGridView {...commonProps} />;
      case 'list':
        return <VendorBookingListView {...commonProps} />;
      case 'table':
        return <VendorBookingTableView {...commonProps} />;
      default:
        return <VendorBookingGridView {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-600 mt-1">{bookings?.length || 0} total bookings</p>
        </div>
        
        <VendorBookingViewToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
      </div>

      {/* Status Filter */}
      <BookingStatusFilter
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        statusCounts={statusCounts}
        totalBookings={bookings?.length || 0}
      />

      {/* Booking Content */}
      {filteredBookings.length > 0 ? (
        renderBookingsContent()
      ) : (
        <EmptyBookingsState
          isFiltered={statusFilter !== 'all'}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
};

export default VendorBookings;
