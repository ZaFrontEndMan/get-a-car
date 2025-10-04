import React from "react";
import BasicInformationSection from "./BasicInformationSection";
import PricingSection from "./PricingSection";
import PaidFeaturesSection from "./PaidFeaturesSection";
import ImageSection from "./ImageSection";
import FeaturesSection from "./FeaturesSection";
import LocationsSection from "./LocationsSection";
import OtherDetailsSection from "./OtherDetailsSection";

interface PaidFeature {
  title: string;
  price: number;
}

interface CarFormContentProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  paidFeatures: PaidFeature[];
  setPaidFeatures: React.Dispatch<React.SetStateAction<PaidFeature[]>>;
  pickupLocations: string[];
  setPickupLocations: React.Dispatch<React.SetStateAction<string[]>>;
  dropoffLocations: string[];
  setDropoffLocations: React.Dispatch<React.SetStateAction<string[]>>;
  branches?: Array<{ id: string; name: string }>;
  branchesLoading?: boolean;
  t: (key: string, params?: Record<string, any>) => string; // Translation function
}

const CarFormContent = ({
  formData,
  handleChange,
  paidFeatures,
  setPaidFeatures,
  pickupLocations,
  setPickupLocations,
  dropoffLocations,
  setDropoffLocations,
  branches,
  branchesLoading,
  t,
}: CarFormContentProps) => {
  return (
    <div className="space-y-6">
      <BasicInformationSection
        t={t}
        formData={formData}
        handleChange={handleChange}
      />
      <PricingSection t={t} formData={formData} handleChange={handleChange} />
      <ImageSection t={t} formData={formData} handleChange={handleChange} />
      <FeaturesSection t={t} formData={formData} handleChange={handleChange} />
      <LocationsSection
        t={t}
        pickupLocations={pickupLocations}
        dropoffLocations={dropoffLocations}
        setPickupLocations={setPickupLocations}
        setDropoffLocations={setDropoffLocations}
      />
      <PaidFeaturesSection
        t={t}
        paidFeatures={paidFeatures}
        setPaidFeatures={setPaidFeatures}
      />
      <OtherDetailsSection
        t={t}
        formData={formData}
        handleChange={handleChange}
        branches={branches}
        branchesLoading={branchesLoading}
      />
    </div>
  );
};

export default CarFormContent;
