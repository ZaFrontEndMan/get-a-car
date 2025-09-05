import React from "react";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarsFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedVendors: string[];
  setSelectedVendors: (vendors: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onClearFilters: () => void;
  filterData?: {
    vendorNames?: { name: string; quantity: number }[];
    branches?: { name: string; quantity: number }[];
    types?: { name: string; quantity: number }[];
    transmissions?: { name: string; quantity: number }[];
    fuelTypes?: { name: string; quantity: number }[];
    maxPrice?: number;
  };
}

const CarsFilters = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedVendors,
  setSelectedVendors,
  searchTerm,
  setSearchTerm,
  onClearFilters,
  filterData,
}: CarsFiltersProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  const handleVendorToggle = (vendor: string) => {
    setSelectedVendors(
      selectedVendors.includes(vendor)
        ? selectedVendors.filter((v) => v !== vendor)
        : [...selectedVendors, vendor]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedCategories(
      selectedCategories.includes(brand)
        ? selectedCategories.filter((c) => c !== brand)
        : [...selectedCategories, brand]
    );
  };

  if (!filterData) {
    return (
      <div className="hidden lg:block flex-shrink-0 w-52">
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
            <div className="animate-pulse">{t("loading")}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block flex-shrink-0 w-52">
      <div className="sticky top-24">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold">{t("filters")}</h2>
              <button
                onClick={onClearFilters}
                className="text-xs text-blue-200 hover:text-white transition-colors"
              >
                {t("clearAll")}
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-3 text-xs text-gray-800 uppercase tracking-wide">
                {t("search")}
              </h3>
              <input
                type="text"
                placeholder={t("searchCars")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-xs ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3 text-xs text-gray-800 uppercase tracking-wide">
                {t("priceRange")}
              </h3>
              <Slider
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value as [number, number]);
                }}
                max={filterData?.maxPrice || 2000}
                step={50}
                className="mb-2"
              />
              <div className="text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1">
                {t("currency")} {priceRange[0]} - {t("currency")}{" "}
                {priceRange[1]}
              </div>
            </div>

            {/* Vendors */}
            {filterData?.vendorNames && filterData.vendorNames.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t("vendors")}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.vendorNames.map((vendor) => (
                    <label
                      key={vendor.name}
                      className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.name)}
                        onChange={() => handleVendorToggle(vendor.name)}
                        className={`${
                          isRTL ? "ml-2" : "mr-2"
                        } w-3 h-3 text-primary`}
                      />
                      <span
                        className={`flex-1 text-gray-700 ${
                          isRTL ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {vendor.name} ({vendor.quantity})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Car Types */}
            {filterData?.types && filterData.types.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t("carTypes")}
                </div>
                <div className="space-y-2">
                  {filterData.types.map((type) => (
                    <label
                      key={type.name}
                      className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(type.name)}
                        onChange={() => handleCategoryToggle(type.name)}
                        className={`${
                          isRTL ? "ml-2" : "mr-2"
                        } w-3 h-3 text-primary`}
                      />
                      <span
                        className={`flex-1 text-gray-700 ${
                          isRTL ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {type.name} ({type.quantity})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Fuel Types */}
            {filterData?.fuelTypes && filterData.fuelTypes.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t("fuelTypes")}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.fuelTypes.map((fuelType) => (
                    <label
                      key={fuelType.name}
                      className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(fuelType.name)}
                        onChange={() => handleBrandToggle(fuelType.name)}
                        className={`${
                          isRTL ? "ml-2" : "mr-2"
                        } w-3 h-3 text-primary`}
                      />
                      <span
                        className={`flex-1 text-gray-700 ${
                          isRTL ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {fuelType.name} ({fuelType.quantity})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Branches */}
            {filterData?.branches && filterData.branches.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t("branches")}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.branches.map((branch) => (
                    <label
                      key={branch.name}
                      className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(branch.name)}
                        onChange={() => handleCategoryToggle(branch.name)}
                        className={`${
                          isRTL ? "ml-2" : "mr-2"
                        } w-3 h-3 text-primary`}
                      />
                      <span
                        className={`flex-1 text-gray-700 ${
                          isRTL ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {branch.name} ({branch.quantity})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Transmissions */}
            {filterData?.transmissions &&
              filterData.transmissions.length > 0 && (
                <div>
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                    {t("transmissions")}
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filterData.transmissions.map((transmission) => (
                      <label
                        key={transmission.name}
                        className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(
                            transmission.name
                          )}
                          onChange={() =>
                            handleCategoryToggle(transmission.name)
                          }
                          className={`${
                            isRTL ? "ml-2" : "mr-2"
                          } w-3 h-3 text-primary`}
                        />
                        <span
                          className={`flex-1 text-gray-700 ${
                            isRTL ? "text-right pr-2" : "text-left pl-2"
                          }`}
                        >
                          {transmission.name} ({transmission.quantity})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsFilters;
