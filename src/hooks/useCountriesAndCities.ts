// src/hooks/useCountriesAndCities.ts
import { constantsApi } from "@/api/website/constantsApi";
import { useQuery } from "@tanstack/react-query";

export interface Country {
  id: string;
  name_en: string;
  name_ar: string;
  code: string;
  is_active: boolean;
}

export interface City {
  id: string;
  country_id: string;
  name_en: string;
  name_ar: string;
  is_active: boolean;
}

// Map backend -> UI model
const mapApiCountryToCountry = (c: { id: number; name: string }): Country => ({
  id: String(c.id),
  name_en: c.name, // backend returns single name; use it for both for now
  name_ar: c.name,
  code: "", // not provided by API
  is_active: true, // not provided by API
});

const mapApiCityToCity = (c: {
  id: number;
  name: string;
  countryId: number;
}): City => ({
  id: String(c.id),
  country_id: String(c.countryId),
  name_en: c.name,
  name_ar: c.name,
  is_active: true,
});

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const apiCountries = await constantsApi.getAllCountries();
      return apiCountries.map(mapApiCountryToCountry);
    },
  });
};

export const useCitiesByCountry = (countryId: string | null) => {
  return useQuery({
    queryKey: ["cities", countryId],
    queryFn: async () => {
      if (!countryId) return [];
      const apiCities = await constantsApi.getAllCities();
      // Filter client-side since the endpoint returns all cities
      return apiCities
        .filter((c) => String(c.countryId) === String(countryId))
        .map(mapApiCityToCity);
    },
    enabled: !!countryId,
  });
};

export const getSaudiArabiaId = async (): Promise<string | null> => {
  try {
    const apiCountries = await constantsApi.getAllCountries();
    // If the backend provides a code later, switch to code === 'SA'.
    // For now, match by Arabic/English name heuristics.
    const match = apiCountries.find((c) => {
      const n = (c.name || "").trim();
      return (
        n.toLowerCase().includes("saudi") || // English heuristic
        n.includes("السعود") || // Arabic heuristic
        n.includes("المملكة") // broader Arabic heuristic
      );
    });
    return match ? String(match.id) : null;
  } catch {
    return null;
  }
};
