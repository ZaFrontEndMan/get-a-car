
import React from 'react';
import BasicInformationSection from './BasicInformationSection';
import PricingSection from './PricingSection';
import PaidFeaturesSection from './PaidFeaturesSection';
import ImageSection from './ImageSection';
import FeaturesSection from './FeaturesSection';
import LocationsSection from './LocationsSection';
import OtherDetailsSection from './OtherDetailsSection';

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
  branchesLoading
}: CarFormContentProps) => {
  return (
    <div className="space-y-6">
      <BasicInformationSection formData={formData} handleChange={handleChange} />
      <PricingSection formData={formData} handleChange={handleChange} />
      <ImageSection formData={formData} handleChange={handleChange} />
      <FeaturesSection formData={formData} handleChange={handleChange} />
      <LocationsSection 
        pickupLocations={pickupLocations}
        dropoffLocations={dropoffLocations}
        setPickupLocations={setPickupLocations}
        setDropoffLocations={setDropoffLocations}
      />
      <PaidFeaturesSection paidFeatures={paidFeatures} setPaidFeatures={setPaidFeatures} />
      <OtherDetailsSection 
        formData={formData} 
        handleChange={handleChange} 
        branches={branches}
        branchesLoading={branchesLoading}
      />
    </div>
  );
};

export default CarFormContent;
