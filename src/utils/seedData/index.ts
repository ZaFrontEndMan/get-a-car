
import { createDefaultVendor } from './vendorData';
import { createDefaultBranches } from './branchData';
import { createDefaultCars } from './carData';
import { createDefaultBookings } from './bookingData';

export const seedDefaultData = async () => {
  try {
    console.log('Starting to seed default data...');

    // Create vendor
    const vendor = await createDefaultVendor();
    
    // Create branches
    const branches = await createDefaultBranches(vendor.id);
    
    // Create cars
    const cars = await createDefaultCars(vendor.id, branches);
    
    // Create bookings
    await createDefaultBookings(vendor.id, cars);

    console.log('Default data seeded successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};
