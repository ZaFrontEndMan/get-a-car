
import { useState, useEffect } from 'react';
import { getDefaultFormData, CarFormData } from './types';

export const useCarForm = (car?: any, _onSuccess?: () => void) => {
  const [formData, setFormData] = useState<CarFormData>(getDefaultFormData());

  useEffect(() => {
    if (car) {
      setFormData({
        id: car.id || '',
        name: car.name || '',
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        type: car.type || '',
        fuel_type: car.fuel_type || '',
        transmission: car.transmission || '',
        seats: car.seats || 4,
        color: car.color || '',
        license_plate: car.license_plate || '',
        daily_rate: car.daily_rate || 0,
        weekly_rate: car.weekly_rate || 0,
        monthly_rate: car.monthly_rate || 0,
        deposit_amount: car.deposit_amount || 0,
        images: car.images || [],
        features: car.features || [],
        is_available: car.is_available ?? true,
        branch_id: car.branch_id || '',
        mileage_limit: car.mileage_limit || 0,
        cancellation_policies: car.cancellation_policies || '',
      });
    } else {
      setFormData(getDefaultFormData());
    }
  }, [car]);

  const handleChange = (field: keyof CarFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
