
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CarFormContent from './CarFormContent';
import { useCarForm } from './useCarForm';
import { usePaidFeatures } from './usePaidFeatures';
import { useLocations } from './useLocations';
import { useBranches } from './useBranches';

interface CarFormProps {
  car?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CarForm = ({ car, onClose, onSuccess }: CarFormProps) => {
  const { formData, mutation, handleChange, handleSubmit } = useCarForm(car, onSuccess);
  const { paidFeatures, setPaidFeatures } = usePaidFeatures(car);
  const { pickupLocations, setPickupLocations, dropoffLocations, setDropoffLocations } = useLocations(car);
  const { data: branches, isLoading: branchesLoading } = useBranches();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the complete form data including locations and paid features
    const completeFormData = {
      ...formData,
      pickup_locations: pickupLocations.filter(loc => loc.trim() !== ''),
      dropoff_locations: dropoffLocations.filter(loc => loc.trim() !== ''),
      paid_features: paidFeatures.length > 0 ? JSON.stringify(paidFeatures) : null
    };

    console.log('Submitting complete form data:', completeFormData);
    mutation.mutate(completeFormData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{car ? 'Edit Car' : 'Add New Car'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <CarFormContent
              formData={formData}
              handleChange={handleChange}
              paidFeatures={paidFeatures}
              setPaidFeatures={setPaidFeatures}
              pickupLocations={pickupLocations}
              setPickupLocations={setPickupLocations}
              dropoffLocations={dropoffLocations}
              setDropoffLocations={setDropoffLocations}
              branches={branches}
              branchesLoading={branchesLoading}
            />

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Saving...' : (car ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarForm;
