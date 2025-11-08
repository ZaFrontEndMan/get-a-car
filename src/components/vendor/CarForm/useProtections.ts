import { useState, useEffect } from "react";

interface Protection {
  id?: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const useProtections = (car?: any) => {
  const [protections, setProtections] = useState<Protection[]>([]);

  useEffect(() => {
    if (car?.protections && Array.isArray(car.protections)) {
      const prots = car.protections.map((prot: any) => ({
        id: prot.id,
        nameAr: prot.nameAr || "",
        nameEn: prot.nameEn || "",
        descriptionAr: prot.descriptionAr || "",
        descriptionEn: prot.descriptionEn || "",
      }));
      setProtections(prots);
    }
  }, [car]);

  return {
    protections,
    setProtections,
  };
};
