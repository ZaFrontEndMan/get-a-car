import { useState, useEffect } from "react";

interface PaidFeature {
  id?: number;
  title: string;
  titleAr?: string;
  titleEn?: string;
  price: number;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

export const usePaidFeatures = (car?: any) => {
  const [paidFeatures, setPaidFeatures] = useState<PaidFeature[]>([]);

  useEffect(() => {
    if (car?.carServices && Array.isArray(car.carServices)) {
      const features = car.carServices.map((service: any) => ({
        id: service.id,
        title: service.nameAr || service.nameEn || "",
        titleAr: service.nameAr || "",
        titleEn: service.nameEn || "",
        price: service.price || 0,
        description: service.description || service.DescriptionEn || "",
        descriptionAr: service.descriptionAr || "",
        descriptionEn: service.descriptionEn || "",
      }));
      setPaidFeatures(features);
    }
  }, [car]);

  return {
    paidFeatures,
    setPaidFeatures,
  };
};
