
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking?: string;
  status: string;
  joinedDate: string;
}

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      console.log('Fetching clients data...');
      setLoading(true);

      // Try to fetch from the new get_clients_data function
      const { data: clientsData, error: clientsError } = await supabase
        .rpc('get_clients_data' as any);

      if (clientsError) {
        console.error('RPC get_clients_data error:', clientsError);
        // Fallback to profiles approach
        return await fetchClientsFromProfiles();
      }

      if (clientsData) {
        console.log('Clients data from RPC:', clientsData);
        const processedClients = clientsData.map((client: any) => ({
          id: client.id,
          name: client.name || 'Unknown User',
          email: client.email || 'Email not available',
          phone: client.phone,
          totalBookings: Number(client.totalbookings || 0),
          totalSpent: Number(client.totalspent || 0),
          lastBooking: client.lastbooking,
          status: client.status || 'active',
          joinedDate: client.joineddate
        }));
        setClients(processedClients);
      } else {
        // Fallback if no data
        await fetchClientsFromProfiles();
      }

    } catch (error) {
      console.error('Error fetching clients:', error);
      // Fallback to profiles approach
      await fetchClientsFromProfiles();
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsFromProfiles = async () => {
    try {
      // Fetch client profiles from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          phone,
          created_at
        `)
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Profiles query error:', profilesError);
        throw profilesError;
      }

      console.log('Profiles data fetched:', profilesData);

      // Fetch booking statistics
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          customer_id,
          total_amount,
          created_at,
          booking_status
        `)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Bookings query error:', bookingsError);
        // Don't throw here, continue without booking data
      }

      console.log('Bookings data fetched:', bookingsData);

      // Process client data and calculate statistics
      const clientsMap: { [key: string]: Client } = {};

      // Initialize clients from profiles table
      profilesData?.forEach(profile => {
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Unknown User';
        clientsMap[profile.user_id] = {
          id: profile.user_id,
          name: fullName,
          email: 'Email not available',
          phone: profile.phone,
          totalBookings: 0,
          totalSpent: 0,
          lastBooking: undefined,
          status: 'active',
          joinedDate: profile.created_at
        };
      });

      // Calculate fresh booking statistics
      bookingsData?.forEach(booking => {
        if (clientsMap[booking.customer_id]) {
          clientsMap[booking.customer_id].totalBookings++;
          clientsMap[booking.customer_id].totalSpent += parseFloat(booking.total_amount?.toString() || '0');
          
          if (!clientsMap[booking.customer_id].lastBooking || 
              new Date(booking.created_at) > new Date(clientsMap[booking.customer_id].lastBooking!)) {
            clientsMap[booking.customer_id].lastBooking = booking.created_at;
          }
        }
      });

      const clientsList = Object.values(clientsMap);
      console.log('Processed clients:', clientsList);
      setClients(clientsList);

    } catch (error) {
      console.error('Error fetching clients from profiles:', error);
      toast.error('Failed to fetch clients');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, refetch: fetchClients };
};
