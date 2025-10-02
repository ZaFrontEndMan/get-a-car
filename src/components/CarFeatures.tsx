
import React from 'react';
import { Check } from 'lucide-react';

interface CarFeaturesProps {
  features: string[];
}

const CarFeatures = ({ features }: CarFeaturesProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarFeatures;
