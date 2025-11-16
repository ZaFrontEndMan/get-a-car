import { Booking } from "@/types/clientBookings";

export const getStatusCounts = (bookings: Booking[]) => {
  const counts = bookings.reduce((acc, booking) => {
    const status = booking.bookingStatus || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return counts;
};
export const getAppliedFilterBadges = (filters, t, filterData) => {
  const badges = [];

  // Location filters
  if (filters.pickupLocation) {
    badges.push({ key: t("pickupLocation"), value: filters.pickupLocation });
  }
  if (filters.dropOffLocation) {
    badges.push({ key: t("dropOffLocation"), value: filters.dropOffLocation });
  }

  // Dates
  if (filters.pickupDate) {
    badges.push({
      key: t("pickupDate"),
      value: new Date(filters.pickupDate).toLocaleDateString(),
    });
  }
  if (filters.dropoffDate) {
    badges.push({
      key: t("dropoffDate"),
      value: new Date(filters.dropoffDate).toLocaleDateString(),
    });
  }

  // With driver
  if (filters.withDriver) {
    badges.push({ key: t("withDriver"), value: "" });
  }

  // Vendor names
  if (filters.vendorNames && filters.vendorNames.length) {
    filters.vendorNames.forEach((v) =>
      badges.push({ key: t("vendor"), value: v })
    );
  }

  // Types / categories
  if (filters.types && filters.types.length) {
    filters.types.forEach((v) => badges.push({ key: t("type"), value: t(v) }));
  }
  if (filters.transmissions && filters.transmissions.length) {
    filters.transmissions.forEach((v) =>
      badges.push({ key: t("transmission"), value: t(v) })
    );
  }
  if (filters.fuelTypes && filters.fuelTypes.length) {
    filters.fuelTypes.forEach((v) =>
      badges.push({ key: t("fuelType"), value: t(v) })
    );
  }
  if (filters.makes && filters.makes.length) {
    filters.makes.forEach((v) => badges.push({ key: t("make"), value: t(v) }));
  }
  if (filters.carCapacities && filters.carCapacities.length) {
    filters.carCapacities.forEach((v) =>
      badges.push({ key: t("carCapacity"), value: t(v) })
    );
  }

  // Price range
  if (
    filters.priceRange &&
    ((filters.priceRange.min && filters.priceRange.min > 0) ||
      (filters.priceRange.max &&
        filters.priceRange.max < (filterData?.maxPrice || 2000)))
  ) {
    badges.push({
      key: t("priceRange"),
      value: `${filters.priceRange.min || 0} - ${
        filters.priceRange.max || filterData.maxPrice || 2000
      } ${t("currency")}`,
    });
  }

  // Add more filters as needed

  return badges;
};
