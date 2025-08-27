
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, MapPin } from 'lucide-react';

interface LocationsSectionProps {
  pickupLocations: string[];
  dropoffLocations: string[];
  setPickupLocations: (locations: string[]) => void;
  setDropoffLocations: (locations: string[]) => void;
}

const LocationsSection = ({ 
  pickupLocations, 
  dropoffLocations, 
  setPickupLocations, 
  setDropoffLocations 
}: LocationsSectionProps) => {
  const addPickupLocation = () => {
    setPickupLocations([...pickupLocations, '']);
  };

  const addDropoffLocation = () => {
    setDropoffLocations([...dropoffLocations, '']);
  };

  const updatePickupLocation = (index: number, value: string) => {
    const updated = [...pickupLocations];
    updated[index] = value;
    setPickupLocations(updated);
  };

  const updateDropoffLocation = (index: number, value: string) => {
    const updated = [...dropoffLocations];
    updated[index] = value;
    setDropoffLocations(updated);
  };

  const removePickupLocation = (index: number) => {
    if (pickupLocations.length > 1) {
      setPickupLocations(pickupLocations.filter((_, i) => i !== index));
    }
  };

  const removeDropoffLocation = (index: number) => {
    if (dropoffLocations.length > 1) {
      setDropoffLocations(dropoffLocations.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Pickup & Dropoff Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Pickup Locations</Label>
            <Button type="button" onClick={addPickupLocation} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Location
            </Button>
          </div>
          <div className="space-y-2">
            {pickupLocations.map((location, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={location}
                  onChange={(e) => updatePickupLocation(index, e.target.value)}
                  placeholder="Enter pickup location (e.g., Airport Terminal 1)"
                />
                {pickupLocations.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePickupLocation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Dropoff Locations</Label>
            <Button type="button" onClick={addDropoffLocation} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Location
            </Button>
          </div>
          <div className="space-y-2">
            {dropoffLocations.map((location, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={location}
                  onChange={(e) => updateDropoffLocation(index, e.target.value)}
                  placeholder="Enter dropoff location (e.g., City Center)"
                />
                {dropoffLocations.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDropoffLocation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Add multiple pickup and dropoff locations to give customers more flexibility. 
            Popular locations include airports, hotels, city centers, and train stations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationsSection;
