import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDebouncedSlider } from "@/hooks/useDebouncedSlider";

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
  const [isDragging, setIsDragging] = useState(false);

  // Use debounced slider for price range
  const [sliderValue, setSliderValue, debouncedSliderValue] =
    useDebouncedSlider(priceRange, 500, setPriceRange);

  // Update slider value when priceRange prop changes
  useEffect(() => {
    setSliderValue(priceRange);
  }, [priceRange, setSliderValue]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US").format(
      price
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

  const maxPrice = filterData?.maxPrice || 2000;

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
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-xs ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Enhanced Price Range Slider */}
            <div>
              <h3 className="font-semibold mb-3 text-xs text-gray-800 uppercase tracking-wide">
                {t("priceRange")}
              </h3>

              <div className="relative px-1 mb-4">
                <Slider
                  value={sliderValue}
                  onValueChange={(value) => {
                    setSliderValue(value as [number, number]);
                    setIsDragging(true);
                  }}
                  onPointerUp={() => setIsDragging(false)}
                  max={maxPrice}
                  step={50}
                  className={`mb-2 transition-all ${
                    isDragging ? "scale-105" : ""
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              {/* Enhanced Price Display with Cards */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                    {t("min")}
                  </div>
                  <div className="text-xs font-bold text-gray-800">
                    {t("currency")} {formatPrice(sliderValue[0])}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 border border-blue-200">
                  <div className="text-[10px] text-blue-600 uppercase tracking-wide mb-0.5">
                    {t("max")}
                  </div>
                  <div className="text-xs font-bold text-blue-800">
                    {t("currency")} {formatPrice(sliderValue[1])}
                  </div>
                </div>
              </div>

              {/* Price Percentage Indicator */}
              {/* <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                    style={{
                      width: `${
                        ((sliderValue[1] - sliderValue[0]) / maxPrice) * 100
                      }%`,
                      marginLeft: isRTL
                        ? "auto"
                        : `${(sliderValue[0] / maxPrice) * 100}%`,
                      marginRight: !isRTL
                        ? "auto"
                        : `${(sliderValue[0] / maxPrice) * 100}%`,
                    }}
                  />
                </div>
                <span className="whitespace-nowrap">
                  {Math.round(
                    ((sliderValue[1] - sliderValue[0]) / maxPrice) * 100
                  )}
                  %
                </span>
              </div> */}

              {/* Quick Price Presets */}
              {/* <div className="flex gap-1 mt-3">
                {[
                  {
                    label: t("budget") || "Budget",
                    range: [0, maxPrice * 0.3],
                  },
                  {
                    label: t("mid") || "Mid",
                    range: [maxPrice * 0.3, maxPrice * 0.7],
                  },
                  {
                    label: t("premium") || "Premium",
                    range: [maxPrice * 0.7, maxPrice],
                  },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSliderValue([
                        Math.round(preset.range[0]),
                        Math.round(preset.range[1]),
                      ] as [number, number]);
                    }}
                    className="flex-1 text-[9px] px-2 py-1 rounded-md bg-gray-100 hover:bg-primary hover:text-white transition-colors border border-gray-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div> */}
            </div>

            {/* Vendors */}
            {filterData?.vendorNames && filterData.vendorNames.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t("vendors")}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {filterData.vendorNames.map((vendor) => (
                    <label
                      key={vendor.name}
                      className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.name)}
                        onChange={() => handleVendorToggle(vendor.name)}
                        className={`${
                          isRTL ? "ml-2" : "mr-2"
                        } w-3 h-3 text-primary rounded focus:ring-2 focus:ring-primary`}
                      />
                      <span
                        className={`flex-1 text-gray-700 ${
                          isRTL ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {vendor.name}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">
                        {vendor.quantity}
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
                      className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(type.name)}
                        onChange={() => handleCategoryToggle(type.name)}
                        className={`${
                          isRTL ? "ml-2" : "mr-2"
                        } w-3 h-3 text-primary rounded focus:ring-2 focus:ring-primary`}
                      />
                      <span
                        className={`flex-1 text-gray-700 ${
                          isRTL ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {type.name}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">
                        {type.quantity}
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
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {filterData.fuelTypes.map((fuelType) => (
                    <label
                      key={fuelType.name}
                      className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(fuelType.name)}
                        onChange={() => handleBrandToggle(fuelType.name)}
                        className={`${
                          isRTL ? "ml-2" : "mr-2"
                        } w-3 h-3 text-primary rounded focus:ring-2 focus:ring-primary`}
                      />
                      <span
                        className={`flex-1 text-gray-700 ${
                          isRTL ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {fuelType.name}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">
                        {fuelType.quantity}
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
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {filterData.branches.map((branch) => (
                    <label
                      key={branch.name}
                      className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(branch.name)}
                        onChange={() => handleCategoryToggle(branch.name)}
                        className={`${
                          isRTL ? "ml-2" : "mr-2"
                        } w-3 h-3 text-primary rounded focus:ring-2 focus:ring-primary`}
                      />
                      <span
                        className={`flex-1 text-gray-700 ${
                          isRTL ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {branch.name}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">
                        {branch.quantity}
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
                  <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {filterData.transmissions.map((transmission) => (
                      <label
                        key={transmission.name}
                        className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors ${
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
                          } w-3 h-3 text-primary rounded focus:ring-2 focus:ring-primary`}
                        />
                        <span
                          className={`flex-1 text-gray-700 ${
                            isRTL ? "text-right pr-2" : "text-left pl-2"
                          }`}
                        >
                          {transmission.name}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">
                          {transmission.quantity}
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
