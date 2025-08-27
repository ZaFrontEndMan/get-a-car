
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CarFormData, getDefaultFormData } from './types';
import { useCurrentUser } from './useCurrentUser';
import { useCarMutation } from './useCarMutation';

export const useCarForm = (car: any, onSuccess: () => void) => {
  const [formData, setFormData] = useState<CarFormData>(getDefaultFormData());
  const { toast } = useToast();
  const { currentUser } = useCurrentUser();
  const mutation = useCarMutation(onSuccess);

  useEffect(() => {
    if (car) {
      setFormData({
        id: car.id,
        name: car.name || '',
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        type: car.type || 'sedan',
        fuel_type: car.fuel_type || 'petrol',
        transmission: car.transmission || 'automatic',
        seats: car.seats || 5,
        color: car.color || '',
        license_plate: car.license_plate || '',
        daily_rate: car.daily_rate || 0,
        weekly_rate: car.weekly_rate || 0,
        monthly_rate: car.monthly_rate || 0,
        deposit_amount: car.deposit_amount || 0,
        mileage_limit: car.mileage_limit || 300,
        features: car.features || [],
        images: car.images || [],
        is_available: car.is_available ?? true,
        is_featured: car.is_featured ?? false,
        condition: car.condition || 'excellent',
        branch_id: car.branch_id || ''
      });
    }
  }, [car]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create cars",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(formData);
  };

  return {
    formData,
    currentUser,
    mutation,
    handleChange,
    handleSubmit
  };
};
