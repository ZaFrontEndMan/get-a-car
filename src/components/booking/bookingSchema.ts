
import { z } from 'zod';

export const createBookingSchema = (selectedPickup?: string, selectedDropoff?: string) => {
  return z.object({
    pickupDate: z.date({ required_error: "Pickup date is required" }),
    dropoffDate: z.date({ required_error: "Drop-off date is required" }),
    pickupLocation: selectedPickup 
      ? z.string().default(selectedPickup)
      : z.string().min(1, "Pickup location is required"),
    dropoffLocation: selectedDropoff 
      ? z.string().default(selectedDropoff) 
      : z.string().min(1, "Drop-off location is required"),
    needsDriver: z.boolean().default(false),
    driverName: z.string().optional(),
    licenseNumber: z.string().optional(),
    phoneNumber: z.string().optional(),
    cardType: z.string().min(1, "Card type is required"),
    cardNumber: z.string().min(16, "Card number must be 16 digits"),
    cardholderName: z.string().min(1, "Cardholder name is required"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
    cvv: z.string().min(3, "CVV must be at least 3 digits"),
  }).refine((data) => {
    if (data.needsDriver) {
      return data.driverName && data.licenseNumber && data.phoneNumber;
    }
    return true;
  }, {
    message: "Driver information is required when driver is needed",
    path: ["driverName"]
  });
};

export const bookingSchema = createBookingSchema();

export type BookingFormData = z.infer<typeof bookingSchema>;
