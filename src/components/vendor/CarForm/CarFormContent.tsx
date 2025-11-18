import React from "react";
import BasicInformationSection from "./BasicInformationSection";
import PricingSection from "./PricingSection";
import PaidFeaturesSection from "./PaidFeaturesSection";
import ImageSection from "./ImageSection";
import FeaturesSection from "./FeaturesSection";
import LocationsSection from "./LocationsSection";
import ProtectionsSection from "./ProtectionsSection";
import OtherDetailsSection from "./OtherDetailsSection";

interface PaidFeature {
  id?: number;
  serviceTypeId?: number;
  title: string;
  titleAr?: string;
  titleEn?: string;
  price: number;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

interface Location {
  id?: number;
  address: string;
  isActive: boolean;
}

interface Protection {
  id?: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

interface CarFormContentProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  paidFeatures: PaidFeature[];
  setPaidFeatures: React.Dispatch<React.SetStateAction<PaidFeature[]>>;
  pickupLocations: Location[];
  setPickupLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  dropoffLocations: Location[];
  setDropoffLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  protections: Protection[];
  setProtections: React.Dispatch<React.SetStateAction<Protection[]>>;
  branches?: Array<{ id: string; name: string }>;
  branchesLoading?: boolean;
  isViewMode?: boolean;
  t: (key: string, params?: Record<string, any>) => string;
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
  protections,
  setProtections,
  branches,
  branchesLoading,
  t,
  isViewMode,
}: CarFormContentProps) => {
  return (
    <div className="space-y-6">
      <BasicInformationSection
        t={t}
        formData={formData}
        handleChange={handleChange}
      />
      <PricingSection t={t} formData={formData} handleChange={handleChange} />
      <ImageSection
        isViewMode={isViewMode}
        t={t}
        formData={formData}
        handleChange={handleChange}
      />
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
      <ProtectionsSection
        t={t}
        protections={protections}
        setProtections={setProtections}
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
