import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ClientDetailsHeader from '@/components/admin/client-details/ClientDetailsHeader';
import ClientInfoCard from '@/components/admin/client-details/ClientInfoCard';
import ClientBookingsCard from '@/components/admin/client-details/ClientBookingsCard';

interface ClientDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  totalBookings: number;
  totalSpent: number;
  status: string;
  joinedDate: string;
  lastBooking?: string;
  driverLicenseNumber?: string;
  dateOfBirth?: string;
  country?: string;
}

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
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vendor_id: string;
  cars: {
    name: string;
    brand: string;
    model: string;
  } | null;
  vendors: {
    name: string;
  } | null;
}

const AdminClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchClientDetails();
      fetchClientBookings();
    }
  }, [id]);

  const fetchClientDetails = async () => {
    try {
      console.log('Fetching client details for ID:', id);
      
      // First try to get client from clients table with comprehensive data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          *,
          user_id,
          name,
          email,
          phone,
          address,
          city,
          driver_license_number,
          date_of_birth,
          status,
          created_at
        `)
        .eq('user_id', id)
        .single();

      if (clientError && clientError.code !== 'PGRST116') {
        console.error('Error fetching from clients table:', clientError);
      }

      // Also get profile data as fallback
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_id,
          first_name,
          last_name,
          phone,
          address,
          city,
          driver_license_number,
          date_of_birth,
          created_at
        `)
        .eq('user_id', id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Get booking stats from bookings table
      const { data: bookingStats, error: statsError } = await supabase
        .from('bookings')
        .select('total_amount, created_at')
        .eq('customer_id', id);

      if (statsError) {
        console.error('Error fetching booking stats:', statsError);
      }

      console.log('Client data fetched:', clientData);
      console.log('Profile data fetched:', profileData);
      console.log('Booking stats fetched:', bookingStats);

      // Combine data with priority to clients table
      const totalBookings = bookingStats?.length || 0;
      const totalSpent = bookingStats?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
      const lastBooking = bookingStats?.length ? Math.max(...bookingStats.map(b => new Date(b.created_at).getTime())) : null;

      if (clientData || profileData) {
        const combinedClient: ClientDetails = {
          id: id!,
          name: clientData?.name || `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || 'Unknown User',
          email: clientData?.email || 'Email not available',
          phone: clientData?.phone || profileData?.phone,
          address: clientData?.address || profileData?.address,
          city: clientData?.city || profileData?.city,
          totalBookings,
          totalSpent,
          status: clientData?.status || 'active',
          joinedDate: clientData?.created_at || profileData?.created_at || new Date().toISOString(),
          lastBooking: lastBooking ? new Date(lastBooking).toISOString() : undefined,
          driverLicenseNumber: clientData?.driver_license_number || profileData?.driver_license_number
        };

        console.log('Combined client data:', combinedClient);
        setClient(combinedClient);
      } else {
        console.log('No client or profile data found');
        toast.error('Client not found');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch client details');
    }
  };

  const fetchClientBookings = async () => {
    try {
      console.log('Fetching bookings for customer ID:', id);
      
      // Use our new RPC function that bypasses RLS
      const { data, error } = await supabase
        .rpc('get_client_bookings', { client_user_id: id });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings');
        return;
      }

      console.log('Fetched bookings:', data);
      
      // Transform the RPC result to match our Booking interface
      const transformedBookings = data?.map((booking: any) => ({
        id: booking.id,
        booking_number: booking.booking_number,
        car_id: booking.car_id,
        vendor_id: booking.vendor_id,
        customer_id: booking.customer_id,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        pickup_date: booking.pickup_date,
        return_date: booking.return_date,
        total_amount: booking.total_amount,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        created_at: booking.created_at,
        cars: {
          name: booking.car_name,
          brand: booking.car_brand,
          model: booking.car_model,
        },
        vendors: {
          name: booking.vendor_name,
        },
      })) || [];

      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Loading client details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500">Client not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <ClientDetailsHeader
            clientName={client.name}
            clientStatus={client.status}
            totalBookings={client.totalBookings}
            totalSpent={client.totalSpent}
            joinedDate={client.joinedDate}
            onBackClick={() => navigate('/admin')}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              <ClientInfoCard client={client} />
            </div>
            
            <div className="xl:col-span-2">
              <ClientBookingsCard bookings={bookings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientDetails;
