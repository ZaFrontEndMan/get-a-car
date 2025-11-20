import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { MapPin, Search, Plus, Minus, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  usePickUpLocations,
  useDropOffLocations,
} from "@/hooks/website/useLocations";
import { useDebounce } from "@/hooks/useDebounce";
import Fuse from "fuse.js";

const SearchBar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    pickupLocation: "",
    dropOffLocation: "",
    pickupDate: "",
    dropoffDate: "",
    withDriver: false,
  });

  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [pickupSearchTerm, setPickupSearchTerm] = useState("");
  const [dropoffSearchTerm, setDropoffSearchTerm] = useState("");

  // Validation errors state
  const [errors, setErrors] = useState({
    pickupLocation: "",
    dropOffLocation: "",
  });

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const debouncedPickupSearch = useDebounce(pickupSearchTerm, 300);
  const debouncedDropoffSearch = useDebounce(dropoffSearchTerm, 300);

  const { data: pickupLocationsData, isLoading: pickupLoading } =
    usePickUpLocations();
  const { data: dropoffLocationsData, isLoading: dropoffLoading } =
    useDropOffLocations();

  const fuseOptions = {
    keys: ["address"],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 1,
  };

  // Memoized Fuse instances
  const pickupFuse = useMemo(() => {
    if (pickupLocationsData?.data) {
      return new Fuse(pickupLocationsData.data, fuseOptions);
    }
    return null;
  }, [pickupLocationsData?.data]);

  const dropoffFuse = useMemo(() => {
    if (dropoffLocationsData?.data) {
      return new Fuse(dropoffLocationsData.data, fuseOptions);
    }
    return null;
  }, [dropoffLocationsData?.data]);

  const filteredPickupLocations = useMemo(() => {
    if (!pickupFuse || !debouncedPickupSearch?.trim()) {
      return pickupLocationsData?.data?.slice(0, 10) || [];
    }
    return pickupFuse
      .search(debouncedPickupSearch)
      .slice(0, 10)
      .map((r) => r.item);
  }, [pickupFuse, debouncedPickupSearch, pickupLocationsData?.data]);

  const filteredDropoffLocations = useMemo(() => {
    if (!dropoffFuse || !debouncedDropoffSearch?.trim()) {
      return dropoffLocationsData?.data?.slice(0, 10) || [];
    }
    return dropoffFuse
      .search(debouncedDropoffSearch)
      .slice(0, 10)
      .map((r) => r.item);
  }, [dropoffFuse, debouncedDropoffSearch, dropoffLocationsData?.data]);

  // INITIALIZE: Pickup after 1 hour (rounded up to next half hour)
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60);

    // Round up to nearest 30 minutes
    const minutes = now.getMinutes();
    if (minutes > 0 && minutes <= 30) now.setMinutes(30, 0, 0);
    else if (minutes > 30) {
      now.setHours(now.getHours() + 1, 0, 0, 0);
    }

    const dropoff = new Date(now);
    dropoff.setDate(dropoff.getDate() + 1);

    setSearchData((prev) => ({
      ...prev,
      pickupDate: now.toISOString().slice(0, 16),
      dropoffDate: dropoff.toISOString().slice(0, 16),
    }));
  }, []);

  // Calculate rental days
  const calculateRentalDays = () => {
    if (!searchData.pickupDate || !searchData.dropoffDate) return 0;
    const pickup = new Date(searchData.pickupDate);
    const dropoff = new Date(searchData.dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const adjustRentalDays = (direction) => {
    const pickupDate = new Date(searchData.pickupDate);
    let dropoffDate = new Date(searchData.dropoffDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (direction === "add") {
      dropoffDate.setDate(dropoffDate.getDate() + 1);
    } else {
      const newDropoffDate = new Date(dropoffDate);
      newDropoffDate.setDate(newDropoffDate.getDate() - 1);
      if (newDropoffDate <= pickupDate || newDropoffDate < today) return;
      dropoffDate = newDropoffDate;
    }
    setSearchData((prev) => ({
      ...prev,
      dropoffDate: dropoffDate.toISOString().slice(0, 16),
    }));
  };

  // Get current location
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
      }
      const position = await new Promise((resolve) =>
        navigator.geolocation.getCurrentPosition(resolve, resolve, {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 60000,
        })
      );
      const { latitude, longitude } = position.coords;
      const currentLocationName =
        t("currentLocation") +
        ` (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
      setSearchData((prev) => ({
        ...prev,
        pickupLocation: currentLocationName,
        dropOffLocation: currentLocationName,
      }));
      setPickupSearchTerm(currentLocationName);
      setDropoffSearchTerm(currentLocationName);

      // Clear errors when location is set
      setErrors({ pickupLocation: "", dropOffLocation: "" });
    } catch (error) {
      alert(t("locationPermission") + " - " + (error && error.message));
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target)) {
        setShowPickupSuggestions(false);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target)) {
        setShowDropoffSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {
      pickupLocation: "",
      dropOffLocation: "",
    };

    if (!searchData.pickupLocation.trim()) {
      newErrors.pickupLocation = t("fieldRequired");
    }

    if (!searchData.dropOffLocation.trim()) {
      newErrors.dropOffLocation = t("fieldRequired");
    }

    setErrors(newErrors);
    return !newErrors.pickupLocation && !newErrors.dropOffLocation;
  };

  const handleSearch = () => {
    if (!validateForm()) {
      return;
    }

    const searchParams = new URLSearchParams();
    Object.entries(searchData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        searchParams.set(key, value.toString());
      }
    });
    navigate(`/cars?${searchParams.toString()}`);
  };

  const handleLocationSelect = (location, type) => {
    if (type === "pickup") {
      setSearchData((prev) => ({
        ...prev,
        pickupLocation: location.address,
        dropOffLocation: location.address,
      }));
      setPickupSearchTerm(location.address);
      setDropoffSearchTerm(location.address);
      setShowPickupSuggestions(false);
      // Clear errors
      setErrors((prev) => ({
        ...prev,
        pickupLocation: "",
        dropOffLocation: "",
      }));
    } else {
      setSearchData((prev) => ({
        ...prev,
        dropOffLocation: location.address,
      }));
      setDropoffSearchTerm(location.address);
      setShowDropoffSuggestions(false);
      // Clear error
      setErrors((prev) => ({ ...prev, dropOffLocation: "" }));
    }
  };

  const adjustDate = (type, direction) => {
    const currentDate =
      type === "pickup"
        ? new Date(searchData.pickupDate)
        : new Date(searchData.dropoffDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (direction === "add") {
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      if (newDate < today) return;
      currentDate.setTime(newDate.getTime());
    }
    const formattedDate = currentDate.toISOString().slice(0, 16);
    if (type === "pickup") {
      setSearchData((prev) => ({
        ...prev,
        pickupDate: formattedDate,
      }));
      const dropoffDateTime = new Date(searchData.dropoffDate);
      if (currentDate >= dropoffDateTime) {
        const newDropoff = new Date(currentDate);
        newDropoff.setDate(newDropoff.getDate() + 1);
        setSearchData((prev) => ({
          ...prev,
          dropoffDate: newDropoff.toISOString().slice(0, 16),
        }));
      }
    } else {
      const pickupDateTime = new Date(searchData.pickupDate);
      if (currentDate <= pickupDateTime) return;
      setSearchData((prev) => ({
        ...prev,
        dropoffDate: formattedDate,
      }));
    }
  };

  const rentalDays = calculateRentalDays();

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl mx-auto px-4 z-10">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 md:p-6 border border-white/20">
        {/* Driver Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100/80 rounded-full p-1 flex">
            <button
              onClick={() =>
                setSearchData((prev) => ({ ...prev, withDriver: false }))
              }
              className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 text-sm ${
                !searchData.withDriver
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {t("withoutDriver")}
            </button>
            <button
              onClick={() =>
                setSearchData((prev) => ({ ...prev, withDriver: true }))
              }
              className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 text-sm ${
                searchData.withDriver
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {t("withDriver")}
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          {/* Pickup Location */}
          <div className="relative" ref={pickupRef}>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("pickupLocation")}
                value={searchData.pickupLocation}
                onChange={(e) => {
                  setPickupSearchTerm(e.target.value);
                  setSearchData((prev) => ({
                    ...prev,
                    pickupLocation: e.target.value,
                  }));
                  setShowPickupSuggestions(true);
                  // Clear error on change
                  if (errors.pickupLocation) {
                    setErrors((prev) => ({ ...prev, pickupLocation: "" }));
                  }
                }}
                onFocus={() => setShowPickupSuggestions(true)}
                className={`w-full pl-8 pr-10 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/70 ${
                  errors.pickupLocation
                    ? "border-red-500"
                    : "border-gray-300/50"
                }`}
              />
              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="absolute right-2 top-2 p-0.5 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
                title={t("detectLocation")}
              >
                <Navigation
                  className={`h-4 w-4 ${
                    isGettingLocation ? "animate-spin" : ""
                  }`}
                />
              </button>
              {showPickupSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                  {pickupLoading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Loading locations...
                    </div>
                  ) : filteredPickupLocations.length > 0 ? (
                    filteredPickupLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location, "pickup")}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="truncate">{location.address}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.pickupLocation && (
              <p className="text-red text-xs mt-1">
                {errors.pickupLocation}
              </p>
            )}
          </div>

          {/* Dropoff Location */}
          <div className="relative" ref={dropoffRef}>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("dropoffLocation")}
                value={searchData.dropOffLocation}
                onChange={(e) => {
                  setDropoffSearchTerm(e.target.value);
                  setSearchData((prev) => ({
                    ...prev,
                    dropOffLocation: e.target.value,
                  }));
                  setShowDropoffSuggestions(true);
                  // Clear error on change
                  if (errors.dropOffLocation) {
                    setErrors((prev) => ({ ...prev, dropOffLocation: "" }));
                  }
                }}
                onFocus={() => setShowDropoffSuggestions(true)}
                className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/70 ${
                  errors.dropOffLocation
                    ? "border-red-500"
                    : "border-gray-300/50"
                }`}
              />
              {showDropoffSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                  {dropoffLoading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Loading locations...
                    </div>
                  ) : filteredDropoffLocations.length > 0 ? (
                    filteredDropoffLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() =>
                          handleLocationSelect(location, "dropoff")
                        }
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="truncate">{location.address}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.dropOffLocation && (
              <p className="text-red text-xs mt-1">
                {errors.dropOffLocation}
              </p>
            )}
          </div>

          {/* Pickup Date */}
          <div className="relative">
            <input
              type="datetime-local"
              value={searchData.pickupDate}
              onChange={(e) =>
                setSearchData((prev) => ({
                  ...prev,
                  pickupDate: e.target.value,
                }))
              }
              min={new Date().toISOString().slice(0, 16)}
              className="w-full ps-8 pe-16 py-2 text-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/70"
            />
          </div>

          {/* Dropoff Date */}
          <div className="relative">
            <input
              type="datetime-local"
              value={searchData.dropoffDate}
              onChange={(e) =>
                setSearchData((prev) => ({
                  ...prev,
                  dropoffDate: e.target.value,
                }))
              }
              min={
                searchData.pickupDate || new Date().toISOString().slice(0, 16)
              }
              className="w-full ps-8 pe-16 py-2 text-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/70"
            />
          </div>
        </div>

        {/* Search Button with Day Counter */}
        <div className="flex justify-center items-center gap-4">
          {rentalDays > 0 && (
            <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustRentalDays("subtract")}
                className=" text-blue-600 hover:text-blue-800 p-2 hover:bg-primary/10 rounded-full"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span>
                {rentalDays} {t("days")}
              </span>
              <button
                type="button"
                onClick={() => adjustRentalDays("add")}
                className=" text-blue-600 hover:text-blue-800 p-2 hover:bg-primary/10 rounded-full"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          )}
          <button
            onClick={handleSearch}
            className="gradient-primary px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 rtl:gap-reverse text-zinc-50 bg-blue-900 hover:bg-blue-800"
          >
            <Search className="h-4 w-4" />
            <span>{t("searchCars")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
