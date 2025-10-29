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
  serviceTypeId?: number;
}

export const usePaidFeatures = (car?: any) => {
  const [paidFeatures, setPaidFeatures] = useState<PaidFeature[]>([]);

  useEffect(() => {
    if (car?.carServices && Array.isArray(car.carServices)) {
      const features = car.carServices.map((service: any) => ({
        id: service.id,
        title: service.name || service.NameEn || "",
        titleAr: service.NameAr || "",
        titleEn: service.NameEn || "",
        price: service.price || service.Price || 0,
        description: service.description || service.DescriptionEn || "",
        descriptionAr: service.DescriptionAr || "",
        descriptionEn: service.DescriptionEn || "",
        serviceTypeId: service.serviceTypeId || service.ServiceTypeId,
      }));
      setPaidFeatures(features);
    }
  }, [car]);

  return {
    paidFeatures,
    setPaidFeatures,
  };
};
