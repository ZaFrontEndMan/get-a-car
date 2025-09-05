import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/layout/navbar/Navbar";
import CarCard from "../components/CarCard";
import CarsHeader from "../components/cars/CarsHeader";
import CarsFilters from "../components/cars/CarsFilters";
import CarsPagination from "../components/cars/CarsPagination";
import { Search } from "lucide-react";
import { useAllCars } from "@/hooks/website/useWebsiteCars";
import CarsSearchControls from "@/components/cars/CarsSearchControls";

const Cars = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 12;

  const {
    data: carsResponse,
    isLoading,
    error,
    refetch,
  } = useAllCars(currentPage, itemsPerPage);

  const cars =
    carsResponse?.carSearchResult.map((car) => ({
      id: car?.carID.toString(),
      title: car?.name || "No title",
      title_ar: "",
      description: car?.description || "No description",
      description_ar: "",
      image: car?.image
        ? `${"https://test.get2cars.com"}/${car.image.replace(/\\/g, "/")}`
        : "https://images.unsplash.com/photo-1549924231-f129b911e442",
      price: car?.pricePerDay || 0,
      vendorName: car?.vendorName || "Unknown Vendor",
      vendor: {
        id: car?.vendorId?.toString(),
        name: car?.vendorName || "Unknown Vendor",
        logo_url: car?.companyLogo
          ? `${"https://test.get2cars.com"}/${car.companyLogo.replace(
              /\\/g,
              "/"
            )}`
          : null,
      },
      extra: {
        model: car?.model,
        fuelType: car?.fuelType,
        branch: car?.branch,
        transmission: car?.transmission,
        type: car?.type,
        pricePerWeek: car?.pricePerWeek,
        pricePerMonth: car?.pricePerMonth,
      },
    })) || [];

  const filteredCars = cars.filter((car) => {
    if (
      searchTerm &&
      !car?.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    const isDefaultPriceRange = priceRange[0] === 0 && priceRange[1] === 2000;
    if (!isDefaultPriceRange) {
      const carPrice = car?.price;
      const minPrice = priceRange[0];
      const maxPrice = priceRange[1];

      console.log(
        `Car ${car?.id}: Price check - Car price: ${carPrice}, Range: [${minPrice}, ${maxPrice}]`
      );

      if (isNaN(carPrice) || carPrice < minPrice || carPrice > maxPrice) {
        console.log(
          `Price filter rejected car: ${car?.title} with price ${carPrice}`
        );
        return false;
      }
    }

    if (
      selectedVendors.length > 0 &&
      !selectedVendors.includes(car?.vendor.name)
    ) {
      return false;
    }

    if (selectedCategories.length > 0) {
      console.log("Selected categories:", selectedCategories);

      const originalCar = carsResponse?.carSearchResult.find(
        (o) => o.carID.toString() === car?.id
      );

      if (!originalCar) {
        console.log(`Could not find original car data for ${car?.id}`);
        return false;
      }

      const matchesCategory = selectedCategories.some((category) => {
        const categoryLower = category.toLowerCase();

        const matchesFuelType =
          originalCar.fuelType &&
          originalCar.fuelType.toLowerCase() === categoryLower;
        const matchesTransmission =
          originalCar.transmission &&
          originalCar.transmission.toLowerCase() === categoryLower;
        const matchesType =
          originalCar.type && originalCar.type.toLowerCase() === categoryLower;
        const matchesBranch =
          originalCar.branch &&
          originalCar.branch.toLowerCase() === categoryLower;

        console.log(`Car ${car?.id}: Checking category: ${category}`);
        console.log(
          `  - Fuel type match: ${matchesFuelType} (${
            originalCar.fuelType || "N/A"
          })`
        );
        console.log(
          `  - Transmission match: ${matchesTransmission} (${
            originalCar.transmission || "N/A"
          })`
        );
        console.log(
          `  - Car type match: ${matchesType} (${originalCar.type || "N/A"})`
        );
        console.log(
          `  - Branch match: ${matchesBranch} (${originalCar.branch || "N/A"})`
        );

        const isMatch =
          matchesFuelType ||
          matchesTransmission ||
          matchesType ||
          matchesBranch;
        console.log(`  - Overall match: ${isMatch}`);

        return isMatch;
      });

      if (!matchesCategory) {
        console.log(
          `Car ${car?.id} (${car?.title}) filtered out by categories`
        );
        return false;
      }
    }

    return true;
  });

  const totalItems = filteredCars.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log(
    "Filtered cars:",
    filteredCars.length,
    "Paginated cars:",
    paginatedCars.length
  );

  const clearAllFilters = () => {
    console.log("Clearing all filters");
    setPriceRange([0, 2000]);
    setSelectedCategories([]);
    setSelectedVendors([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedCategories, selectedVendors, searchTerm]);

  if (error) {
    console.error("Error in cars page:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error loading cars
              </h3>
              <p className="text-gray-500">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-52 flex-shrink-0 hidden lg:block">
              <CarsFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedVendors={selectedVendors}
                setSelectedVendors={setSelectedVendors}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onClearFilters={clearAllFilters}
                filterData={{
                  vendorNames: carsResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "vendorNames"
                  )?.filterData,
                  branches: carsResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "branches"
                  )?.filterData,
                  types: carsResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "types"
                  )?.filterData,
                  transmissions: carsResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "transmissions"
                  )?.filterData,
                  fuelTypes: carsResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "fuelTypes"
                  )?.filterData,
                  maxPrice: carsResponse?.carsCommonProp?.maxPrice,
                }}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <CarsHeader />

              <CarsSearchControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                filteredCarsLength={filteredCars.length}
                currentPage={currentPage}
                totalPages={totalPages}
              />

              {/* Cars Grid */}
              <div
                className={`grid gap-6 mb-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {paginatedCars.map((car, index) => (
                  <div
                    key={car?.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CarCard car={car} />
                  </div>
                ))}
              </div>

              <CarsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />

              {filteredCars.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No cars found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
