import { useState, useEffect } from "react";
import { Car } from "@/types/api/car";

export const useCarForm = (car?: Car | null, _onSuccess?: () => void) => {
  // Returns empty default values matching Car interface types
  const getDefaultFormData = (): Car => ({
    id: 0,
    name: "",
    description: "",
    transmission: "",
    transmissionId: 0,
    model: "",
    modelId: 0,
    tradeMark: "",
    tradeMarkId: 0,
    fuelType: "",
    fuelTypeId: 0,
    type: "",
    typeId: 0,
    branchName: "",
    branchId: "",
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
    availabilityVendor: false,
    availabilityAdmin: false,
    withDriver: false,
    liter: "",
    doors: "",
    vendorCanMakeOffer: false,
    people: null,
    electricMirrors: false,
    cruiseControl: false,
    fogLights: false,
    power: false,
    roofBox: false,
    gps: false,
    remoteControl: false,
    audioInput: false,
    cdPlayer: false,
    bluetooth: false,
    usbInput: false,
    sensors: false,
    ebdBrakes: false,
    airbag: false,
    absBrakes: false,
    year: 0,
    images: [],
    protectionPrice: 0,
    cancellationPolicies: [],
    carServices: [],
    protections: [],
    pickUpLocations: [],
    dropOffLocations: [],
    licenseNumber: 0,
    feedBackNumber: 0,
    isProtection: false,
    rating: null,
    oneStarRatingStats: { numberOfRating: 0, percentage: 0 } as any,
    twoStarRatingStats: { numberOfRating: 0, percentage: 0 } as any,
    threeStarRatingStats: { numberOfRating: 0, percentage: 0 } as any,
    fourStarRatingStats: { numberOfRating: 0, percentage: 0 } as any,
    fiveStarRatingStats: { numberOfRating: 0, percentage: 0 } as any,
    feedbackDtos: [],
  });

  // Initialize with defaults first, then merge with car if provided
  const [formData, setFormData] = useState<Car>(() => {
    if (car) {
      return {
        ...getDefaultFormData(), // Ensure all fields exist with defaults
        ...car, // Override with actual car data
        images: car.images?.map((img: any) => img.imageUrl) || [], // Transform images
      };
    }
    return getDefaultFormData();
  });

  // Reinitialize formData when car prop changes (for editing)
  useEffect(() => {
    if (car) {
      const defaults = getDefaultFormData();
      setFormData({
        ...defaults, // Start with complete defaults
        ...car, // Override with car data
        images: car.images?.map((img: any) => img.imageUrl) || [], // Handle images array
      });
    } else {
      // Reset to defaults when no car (creating new)
      setFormData(getDefaultFormData());
    }
  }, [car]);

  const handleChange = <K extends keyof Car>(field: K, value: Car[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
