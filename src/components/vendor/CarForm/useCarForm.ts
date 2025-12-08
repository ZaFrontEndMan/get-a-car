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
    branchId: 0,
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

  // Helper function to map API response to form data
  const mapCarToFormData = (carData: any): Car => {
    const defaults = getDefaultFormData();
    if (!carData) return defaults;
    
    return {
      ...defaults,
      ...carData,
      // Map modelYear to year if it exists
      year: carData.modelYear ?? carData.year ?? 0,
      // Ensure branchId is set
      branchId: carData.branchId ?? carData.vendorBranchId ?? 0,
      // Ensure images are properly formatted
      images: carData.images?.map((img: any) => 
        typeof img === 'string' ? img : (img?.imageUrl || img?.url || img)
      ) || [],
    };
  };

  // Initialize with defaults first, then merge with car if provided
  const [formData, setFormData] = useState<Car>(() => {
    if (car && car.id) {
      return mapCarToFormData(car);
    }
    return getDefaultFormData();
  });

  // Reinitialize formData when car prop changes (for editing)
  useEffect(() => {
    if (car && car.id) {
      setFormData(mapCarToFormData(car));
    } else if (!car) {
      // Reset to defaults when no car (creating new)
      setFormData(getDefaultFormData());
    }
  }, [car?.id]); // Use car.id as dependency to ensure it updates when car changes

  const handleChange = <K extends keyof Car>(field: K, value: Car[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
