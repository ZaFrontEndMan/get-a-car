
import { useState, useEffect } from 'react';

export const useLocations = (car: any) => {
  const [pickupLocations, setPickupLocations] = useState<string[]>(['']);
  const [dropoffLocations, setDropoffLocations] = useState<string[]>(['']);

  useEffect(() => {
    if (car) {
      if (car.pickup_locations) {
        setPickupLocations(Array.isArray(car.pickup_locations) ? car.pickup_locations : [car.pickup_locations]);
      }
      if (car.dropoff_locations) {
        setDropoffLocations(Array.isArray(car.dropoff_locations) ? car.dropoff_locations : [car.dropoff_locations]);
      }
    }
  }, [car]);

  return { 
    pickupLocations, 
    setPickupLocations, 
    dropoffLocations, 
    setDropoffLocations 
  };
};
