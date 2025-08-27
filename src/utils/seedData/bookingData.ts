
import { supabase } from '@/integrations/supabase/client';

export const createDefaultBookings = async (vendorId: string, cars: any[]) => {
  console.log('Creating default bookings...');

  const bookings = [
    {
      booking_number: 'GC-20240701-0001',
      car_id: cars[0].id,
      vendor_id: vendorId,
      customer_id: '00000000-0000-0000-0000-000000000001', // Replace with actual customer ID
      customer_name: 'Mohammed Al-Saud',
      customer_email: 'mohammed@example.com',
      customer_phone: '+966501111111',
      pickup_date: '2024-07-01T00:00:00Z',
      return_date: '2024-07-05T00:00:00Z',
      pickup_location: 'Riyadh Main Branch',
      return_location: 'Riyadh Main Branch',
      total_days: 4,
      daily_rate: 150.00,
      subtotal: 600.00,
      additional_services: JSON.stringify([
        { service: 'GPS Navigation', price: 25.00, quantity: 4 }
      ]),
      service_fees: 100.00,
      total_amount: 800.00,
      deposit_paid: 500.00,
      payment_status: 'paid',
      booking_status: 'confirmed'
    },
    {
      booking_number: 'GC-20240710-0002',
      car_id: cars[1].id,
      vendor_id: vendorId,
      customer_id: '00000000-0000-0000-0000-000000000002', // Replace with actual customer ID
      customer_name: 'Fatima Al-Zahra',
      customer_email: 'fatima@example.com',
      customer_phone: '+966502222222',
      pickup_date: '2024-07-10T00:00:00Z',
      return_date: '2024-07-12T00:00:00Z',
      pickup_location: 'Airport Branch',
      return_location: 'Airport Branch',
      total_days: 2,
      daily_rate: 350.00,
      subtotal: 700.00,
      service_fees: 50.00,
      total_amount: 750.00,
      deposit_paid: 1000.00,
      payment_status: 'paid',
      booking_status: 'active'
    }
  ];

  const { error: bookingError } = await supabase
    .from('bookings')
    .insert(bookings);

  if (bookingError) {
    console.error('Error creating bookings:', bookingError);
    throw bookingError;
  }

  console.log('Created sample bookings');
};
