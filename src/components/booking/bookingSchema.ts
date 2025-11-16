import { z } from "zod";

export const createBookingSchema = (
  selectedPickup?: string,
  selectedDropoff?: string
) => {
  return z.object({
    pickupDate: z.date({ required_error: "" }),
    dropoffDate: z.date({ required_error: "" }),
    pickupLocation: selectedPickup
      ? z.string().default(selectedPickup)
      : z.string().min(1, ""),
    dropoffLocation: selectedDropoff
      ? z.string().default(selectedDropoff)
      : z.string().min(1, ""),
  });
};

export const bookingSchema = createBookingSchema();

export type BookingFormData = z.infer<typeof bookingSchema>;
