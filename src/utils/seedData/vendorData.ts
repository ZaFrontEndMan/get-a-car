
import { supabase } from '@/integrations/supabase/client';

export const createDefaultVendor = async () => {
  console.log('Creating default vendor...');

  // Check if vendor already exists
  const { data: existingVendor } = await supabase
    .from('vendors')
    .select('id')
    .limit(1)
    .single();

  if (existingVendor) {
    console.log('Vendor already exists');
    return existingVendor;
  }

  // Create a test vendor
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .insert({
      name: 'Premium Car Rentals',
      email: 'admin@premiumcars.com',
      phone: '+966501234567',
      description: 'Leading car rental service in Saudi Arabia with premium vehicles and excellent customer service.',
      location: 'Riyadh, Saudi Arabia',
      website: 'https://premiumcars.com',
      verified: true,
      rating: 4.8,
      total_reviews: 156,
      user_id: '00000000-0000-0000-0000-000000000000' // Replace with actual user ID
    })
    .select()
    .single();

  if (vendorError) {
    console.error('Error creating vendor:', vendorError);
    throw vendorError;
  }

  console.log('Created vendor:', vendor.name);
  return vendor;
};
