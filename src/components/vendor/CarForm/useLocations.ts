import { useState, useEffect } from "react";

interface Location {
  id?: number;
  address: string;
  isActive: boolean;
}

export const useLocations = (car?: any) => {
  const [pickupLocations, setPickupLocations] = useState<Location[]>([
    { address: "", isActive: true },
  ]);
  const [dropoffLocations, setDropoffLocations] = useState<Location[]>([
    { address: "", isActive: true },
  ]);

  useEffect(() => {
    if (car) {
      // Pickup locations
      if (
        car.pickUpLocations &&
        Array.isArray(car.pickUpLocations) &&
        car.pickUpLocations.length > 0
      ) {
        setPickupLocations(
          car.pickUpLocations.map((loc: any) => ({
            id: loc.id,
            address: loc.address || loc.Address || "",
            isActive: loc.isActive ?? loc.IsActive ?? true,
          }))
        );
      }

      // Dropoff locations
      if (
        car.dropOffLocations &&
        Array.isArray(car.dropOffLocations) &&
        car.dropOffLocations.length > 0
      ) {
        setDropoffLocations(
          car.dropOffLocations.map((loc: any) => ({
            id: loc.id,
            address: loc.address || loc.Address || "",
            isActive: loc.isActive ?? loc.IsActive ?? true,
          }))
        );
      }
    }
  }, [car]);

  return {
    pickupLocations,
    setPickupLocations,
    dropoffLocations,
    setDropoffLocations,
  };
};
