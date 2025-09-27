import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  MapPin,
  Calendar,
  Search,
  Plus,
  Minus,
  Navigation,
  ChevronDown,
} from "lucide-react";
import { useCarFilterData } from "@/hooks/useFilterData";
import { useNavigate } from "react-router-dom";
import {
  usePickUpLocations,
  useDropOffLocations,
} from "@/hooks/website/useLocations";
import { useDebounce } from "@/hooks/useDebounce";
import Fuse from "fuse.js";
const SearchBar = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Consolidated search data object
  const [searchData, setSearchData] = useState({
    pickupLocation: "",
    dropOffLocation: "",
    pickupDate: "",
    dropoffDate: "",
    withDriver: false
  });
  
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [pickupSearchTerm, setPickupSearchTerm] = useState("");
  const [dropoffSearchTerm, setDropoffSearchTerm] = useState("");

  // Refs for click outside detection
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  // Debounced search terms
  const debouncedPickupSearch = useDebounce(pickupSearchTerm, 300);
  const debouncedDropoffSearch = useDebounce(dropoffSearchTerm, 300);

  // Location hooks
  const { data: pickupLocationsData, isLoading: pickupLoading } =
    usePickUpLocations();
  const { data: dropoffLocationsData, isLoading: dropoffLoading } =
    useDropOffLocations();

  const { data: filterData } = useCarFilterData();

  // Fuse.js configuration for fuzzy search
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

  // Filtered locations using Fuse.js
  const filteredPickupLocations = useMemo(() => {
    if (!pickupFuse || !debouncedPickupSearch?.trim()) {
      return pickupLocationsData?.data?.slice(0, 10) || [];
    }
    return pickupFuse
      .search(debouncedPickupSearch)
      .slice(0, 10)
      .map((result) => result.item);
  }, [pickupFuse, debouncedPickupSearch, pickupLocationsData?.data]);

  const filteredDropoffLocations = useMemo(() => {
    if (!dropoffFuse || !debouncedDropoffSearch?.trim()) {
      return dropoffLocationsData?.data?.slice(0, 10) || [];
    }
    return dropoffFuse
      .search(debouncedDropoffSearch)
      .slice(0, 10)
      .map((result) => result.item);
  }, [dropoffFuse, debouncedDropoffSearch, dropoffLocationsData?.data]);

  // Calculate rental days
  const calculateRentalDays = () => {
    if (!searchData.pickupDate || !searchData.dropoffDate) return 0;
    const pickup = new Date(searchData.pickupDate);
    const dropoff = new Date(searchData.dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get current location
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
      }
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 60000,
          });
        }
      );

      // Convert coordinates to city name (simplified - in real app you'd use reverse geocoding)
      const { latitude, longitude } = position.coords;
      console.log("Current coordinates:", latitude, longitude);

      // For demo purposes, we'll set it to a default location
      // In a real app, you'd use a reverse geocoding service
      const currentLocationName =
        t("currentLocation") +
        ` (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
      setSearchData(prev => ({
        ...prev,
        pickupLocation: currentLocationName,
        dropOffLocation: currentLocationName
      }));
      setPickupSearchTerm(currentLocationName);
      setDropoffSearchTerm(currentLocationName);
    } catch (error) {
      console.error("Error getting location:", error);
      alert(t("locationPermission") + " - " + (error as Error).message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Set default dates on component mount
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatDateTime = (date: Date) => {
      return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    };
    setSearchData(prev => ({
      ...prev,
      pickupDate: formatDateTime(today),
      dropoffDate: formatDateTime(tomorrow)
    }));
  }, []);

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickupRef.current &&
        !pickupRef.current.contains(event.target as Node)
      ) {
        setShowPickupSuggestions(false);
      }
      if (
        dropoffRef.current &&
        !dropoffRef.current.contains(event.target as Node)
      ) {
        setShowDropoffSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSearch = () => {
    console.log("Search initiated with:", searchData);

    // Validate required fields
    if (!searchData.pickupLocation?.trim()) {
      alert("Please select a pickup location");
      return;
    }
    if (!searchData.dropOffLocation?.trim()) {
      alert("Please select a dropoff location");
      return;
    }

    // Build search parameters using object keys
    const searchParams = new URLSearchParams();
    Object.entries(searchData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        searchParams.set(key, value.toString());
      }
    });

    // Navigate to cars page with search parameters
    navigate(`/cars?${searchParams.toString()}`);
  };
  const handleLocationSelect = (
    location: { address: string; id: number },
    type: "pickup" | "dropoff"
  ) => {
    if (type === "pickup") {
      setSearchData(prev => ({
        ...prev,
        pickupLocation: location.address
      }));
      setPickupSearchTerm(location.address);
      setShowPickupSuggestions(false);
    } else {
      setSearchData(prev => ({
        ...prev,
        dropOffLocation: location.address
      }));
      setDropoffSearchTerm(location.address);
      setShowDropoffSuggestions(false);
    }
  };
  const adjustDate = (
    type: "pickup" | "dropoff",
    direction: "add" | "subtract"
  ) => {
    const currentDate =
      type === "pickup" ? new Date(searchData.pickupDate) : new Date(searchData.dropoffDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for comparison

    if (direction === "add") {
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);

      // Prevent going to past dates
      if (newDate < today) {
        return; // Don't allow past dates
      }
      currentDate.setTime(newDate.getTime());
    }
    const formattedDate = currentDate.toISOString().slice(0, 16);
    if (type === "pickup") {
      setSearchData(prev => ({
        ...prev,
        pickupDate: formattedDate
      }));
      // Ensure dropoff is always after pickup
      const dropoffDateTime = new Date(searchData.dropoffDate);
      if (currentDate >= dropoffDateTime) {
        const newDropoff = new Date(currentDate);
        newDropoff.setDate(newDropoff.getDate() + 1);
        setSearchData(prev => ({
          ...prev,
          dropoffDate: newDropoff.toISOString().slice(0, 16)
        }));
      }
    } else {
      // Ensure dropoff is not before pickup
      const pickupDateTime = new Date(searchData.pickupDate);
      if (currentDate <= pickupDateTime) {
        return; // Don't allow dropoff before pickup
      }
      setSearchData(prev => ({
        ...prev,
        dropoffDate: formattedDate
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
              onClick={() => setSearchData(prev => ({ ...prev, withDriver: false }))}
              className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 text-sm ${
                !searchData.withDriver
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {t("withoutDriver")}
            </button>
            <button
              onClick={() => setSearchData(prev => ({ ...prev, withDriver: true }))}
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
                  setSearchData(prev => ({ ...prev, pickupLocation: e.target.value }));
                  setShowPickupSuggestions(true);
                }}
                onFocus={() => setShowPickupSuggestions(true)}
                className="w-full pl-8 pr-10 py-2 text-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/70"
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
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
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
                  setSearchData(prev => ({ ...prev, dropOffLocation: e.target.value }));
                  setShowDropoffSuggestions(true);
                }}
                onFocus={() => setShowDropoffSuggestions(true)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/70"
              />
              {showDropoffSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
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
          </div>

          {/* Pickup Date */}
          <div className="relative">
            <div className="relative flex items-center">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="datetime-local"
                value={searchData.pickupDate}
                onChange={(e) => setSearchData(prev => ({ ...prev, pickupDate: e.target.value }))}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full pl-8 pr-16 py-2 text-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/70"
              />
              <div className="absolute right-1 top-1 flex flex-col">
                <button
                  type="button"
                  onClick={() => adjustDate("pickup", "add")}
                  className="p-0.5 text-gray-400 hover:text-primary"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustDate("pickup", "subtract")}
                  className="p-0.5 text-gray-400 hover:text-primary"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative flex items-center">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="datetime-local"
                value={searchData.dropoffDate}
                onChange={(e) => setSearchData(prev => ({ ...prev, dropoffDate: e.target.value }))}
                min={searchData.pickupDate || new Date().toISOString().slice(0, 16)}
                className="w-full pl-8 pr-16 py-2 text-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/70"
              />
              <div className="absolute right-1 top-1 flex flex-col">
                <button
                  type="button"
                  onClick={() => adjustDate("dropoff", "add")}
                  className="p-0.5 text-gray-400 hover:text-primary"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustDate("dropoff", "subtract")}
                  className="p-0.5 text-gray-400 hover:text-primary"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button with Day Counter */}
        <div className="flex justify-center items-center gap-4">
          {/* Day Counter */}
          {rentalDays > 0 && (
            <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
              {rentalDays} {t("days")}
            </div>
          )}

          <button
            onClick={handleSearch}
            className="gradient-primary px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse text-zinc-50 bg-blue-900 hover:bg-blue-800"
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
