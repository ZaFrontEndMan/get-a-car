
import { useState, useEffect } from 'react';

interface PaidFeature {
  title: string;
  price: number;
}

export const usePaidFeatures = (car: any) => {
  const [paidFeatures, setPaidFeatures] = useState<PaidFeature[]>([]);

  useEffect(() => {
    if (car?.paid_features) {
      try {
        const features = typeof car.paid_features === 'string' 
          ? JSON.parse(car.paid_features) 
          : car.paid_features;
        setPaidFeatures(Array.isArray(features) ? features : []);
      } catch {
        setPaidFeatures([]);
      }
    }
  }, [car]);

  return { paidFeatures, setPaidFeatures };
};
