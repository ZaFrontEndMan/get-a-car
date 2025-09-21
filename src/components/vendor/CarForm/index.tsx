
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CarFormContent from './CarFormContent';
import { useCarForm } from './useCarForm';
import { usePaidFeatures } from './usePaidFeatures';
import { useLocations } from './useLocations';
import { useGetVendorBranches } from '@/hooks/vendor/useVendorBranch';
import { useCreateCar, useUpdateCar } from '@/hooks/vendor/useVendorCar';
import { useToast } from '@/components/ui/use-toast';

interface CarFormProps {
  car?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CarForm = ({ car, onClose, onSuccess }: CarFormProps) => {
  const { formData, handleChange } = useCarForm(car, onSuccess);
  const { paidFeatures, setPaidFeatures } = usePaidFeatures(car);
  const { pickupLocations, setPickupLocations, dropoffLocations, setDropoffLocations } = useLocations(car);

  const { data, isLoading: branchesLoading } = useGetVendorBranches();
  const branches = React.useMemo(() => {
    const d = data as any;
    let list: any[] = [];
    if (Array.isArray(d?.data?.vendorBranches)) list = d.data.vendorBranches;
    else if (Array.isArray(d?.vendorBranches)) list = d.vendorBranches;
    else if (Array.isArray(d?.data?.data?.branches)) list = d.data.data.branches;
    else if (Array.isArray(d?.data?.branches)) list = d.data.branches;
    else if (Array.isArray(d?.branches)) list = d.branches;
    else if (Array.isArray(d?.data)) list = d.data;
    else if (Array.isArray(d)) list = d;
    return list.map((b) => ({ id: (b?.id ?? '').toString(), name: b?.branchName ?? b?.name ?? 'Branch' }));
  }, [data]);

  const createMutation = useCreateCar();
  const updateMutation = useUpdateCar();
  const { toast } = useToast();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const buildApiFormData = () => {
    const fd = new FormData();

    const carTypeMap: Record<string, number> = {
      sedan: 1,
      suv: 2,
      hatchback: 3,
      coupe: 4,
      convertible: 5,
      wagon: 6,
      pickup: 7,
    };
    const fuelTypeMap: Record<string, number> = {
      petrol: 1,
      diesel: 2,
      electric: 3,
      hybrid: 4,
    };
    const transmissionMap: Record<string, number> = {
      manual: 1,
      automatic: 2,
    };

    const append = (key: string, value: any) => {
      if (value === undefined || value === null) return;
      fd.append(key, typeof value === 'string' ? value : String(value));
    };

    // Pricing
    append('pricePerDay', formData.daily_rate ?? 0);
    append('pricePerWeek', formData.weekly_rate ?? 0);
    append('pricePerMonth', formData.monthly_rate ?? 0);

    // IDs and meta
    append('tradeMarkId', 0); // TODO: map brand -> trademark id if available
    append('modelId', 0); // TODO: map model -> model id if available
    append('carTypeId', carTypeMap[formData.type] ?? 0);
    append('modelYear', formData.year ?? new Date().getFullYear());

    // Driver and license
    append('driverId', 0); // Not captured in UI currently
    append('licenseNumber', formData.license_plate || '');

    // Fuel and transmission
    append('fuelTypeId', fuelTypeMap[formData.fuel_type] ?? 0);
    append('transmissionTypeId', transmissionMap[formData.transmission] ?? 0);

    // Availability / driver option
    append('availability', !!formData.is_available);
    append('withDriver', false); // Not captured in UI currently

    // Body/description
    append('doors', String(formData.seats ?? ''));
    append('description', ''); // No description field in current form

    // Mileage / fuel liter
    append('mileage', formData.mileage_limit ?? 0);
    append('liter', ''); // Not captured in UI currently

    // Policies / services
    append('cancellationPolicies', '');

    // Protections and services
    const protections = (paidFeatures || []).map((pf) => pf.title).join(', ');
    append('protections', protections);
    const carServices = (formData.features || []).join(', ');
    append('carServices', carServices);

    // Locations
    const pickUp = (pickupLocations || []).find((l) => l && l.trim().length > 0) || '';
    const dropOff = (dropoffLocations || []).find((l) => l && l.trim().length > 0) || pickUp;
    append('pickUpLocation', pickUp);
    append('dropOffLocation', dropOff);

    // Feature flags
    const hasFeature = (name: string) => (formData.features || []).some((f: string) => f.toLowerCase().includes(name));
    append('absBrakes', false);
    append('airBag', hasFeature('air bag') || hasFeature('airbag'));
    append('airBagCount', (hasFeature('air bag') || hasFeature('airbag')) ? 2 : 0);
    append('audioInput', hasFeature('audio'));
    append('bluetooth', hasFeature('bluetooth'));
    append('cdplayer', hasFeature('cd'));
    append('cruisecontrol', hasFeature('cruise'));
    append('ebdbrakes', false);
    append('electricmirrors', hasFeature('mirror'));
    append('foglights', hasFeature('fog'));
    append('gps', hasFeature('gps'));
    append('power', hasFeature('power'));
    append('remotecontrol', hasFeature('remote'));
    append('roofbox', hasFeature('roof'));
    append('sensors', hasFeature('sensor'));
    append('usbinput', hasFeature('usb'));

    const protectionPrice = (paidFeatures || []).reduce((sum, pf) => sum + (pf.price || 0), 0);
    append('isProtection', protectionPrice > 0);
    append('protectionPrice', protectionPrice);

    // Images (URLs -> CSV as placeholder; file upload can be added later)
    const imgs: string[] = Array.isArray(formData.images) ? formData.images : [];
    append('images', imgs.join(','));

    return fd;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fd = buildApiFormData();

    if (car?.id) {
      updateMutation.mutate(
        { carId: String(car.id), carData: fd },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Car updated successfully.' });
            onSuccess();
            onClose();
          },
          onError: (error: any) => {
            toast({ title: 'Update failed', description: error?.message || 'Failed to update car', variant: 'destructive' });
          },
        }
      );
    } else {
      createMutation.mutate(fd, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Car created successfully.' });
          onSuccess();
          onClose();
        },
        onError: (error: any) => {
          toast({ title: 'Creation failed', description: error?.message || 'Failed to create car', variant: 'destructive' });
        },
      });
    }
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
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (car ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarForm;
