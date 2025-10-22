import { z } from "zod";

export const createBookingSchema = (
  selectedPickup?: string,
  selectedDropoff?: string
) => {
  return z.object({
    pickupDate: z.date({ required_error: "Pickup date is required" }),
    dropoffDate: z.date({ required_error: "Drop-off date is required" }),
    pickupLocation: selectedPickup
      ? z.string().default(selectedPickup)
      : z.string().min(1, "Pickup location is required"),
    dropoffLocation: selectedDropoff
      ? z.string().default(selectedDropoff)
      : z.string().min(1, "Drop-off location is required"),
  });
};

export const bookingSchema = createBookingSchema();

export type BookingFormData = z.infer<typeof bookingSchema>;
