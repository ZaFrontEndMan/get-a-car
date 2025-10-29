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
        nameAr: prot.name || prot.NameAr || "",
        nameEn: prot.NameEn || "",
        descriptionAr: prot.description || prot.DescriptionAr || "",
        descriptionEn: prot.DescriptionEn || "",
      }));
      setProtections(prots);
    }
  }, [car]);

  return {
    protections,
    setProtections,
  };
};
