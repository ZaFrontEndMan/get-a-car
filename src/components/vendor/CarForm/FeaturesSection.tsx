
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface FeaturesSectionProps {
  formData: {
    features: string[];
  };
  handleChange: (field: string, value: any) => void;
}

const FeaturesSection = ({ formData, handleChange }: FeaturesSectionProps) => {
  const [newFeature, setNewFeature] = useState('');

  const commonFeatures = [
    'Air Conditioning',
    'Bluetooth',
    'GPS Navigation',
    'Backup Camera',
    'Leather Seats',
    'Sunroof',
    'Cruise Control',
    'USB Charging',
    'Apple CarPlay',
    'Android Auto',
    'Heated Seats',
    'Parking Sensors',
    'Keyless Entry',
    'Premium Sound System',
    'All-Wheel Drive'
  ];

  const addFeature = (feature: string) => {
    if (feature.trim() && !formData.features.includes(feature.trim())) {
      const updatedFeatures = [...formData.features, feature.trim()];
      handleChange('features', updatedFeatures);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    const updatedFeatures = formData.features.filter(feature => feature !== featureToRemove);
    handleChange('features', updatedFeatures);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Car Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label htmlFor="new-feature">Add Custom Feature</Label>
            <Input
              id="new-feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Enter feature name"
            />
          </div>
          <Button
            type="button"
            onClick={() => addFeature(newFeature)}
            className="mt-6"
            disabled={!newFeature.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div>
          <Label>Quick Add Common Features</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonFeatures.map((feature) => (
              <Button
                key={feature}
                type="button"
                variant={formData.features.includes(feature) ? "default" : "outline"}
                size="sm"
                onClick={() => 
                  formData.features.includes(feature) 
                    ? removeFeature(feature)
                    : addFeature(feature)
                }
              >
                {feature}
              </Button>
            ))}
          </div>
        </div>

        {formData.features.length > 0 && (
          <div>
            <Label>Selected Features ({formData.features.length})</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(feature)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
