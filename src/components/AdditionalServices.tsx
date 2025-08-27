
import React from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Service {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

interface AdditionalServicesProps {
  services: Service[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
}

const AdditionalServices = ({
  services,
  selected,
  onSelectionChange
}: AdditionalServicesProps) => {
  const { t } = useLanguage();

  const toggleService = (serviceId: string) => {
    if (selected.includes(serviceId)) {
      onSelectionChange(selected.filter(id => id !== serviceId));
    } else {
      onSelectionChange([...selected, serviceId]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
        <Plus className="h-5 w-5 text-primary" />
        <span>{t('additionalServices')}</span>
      </h3>
      
      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                checked={selected.includes(service.id)}
                onChange={() => toggleService(service.id)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="font-medium text-gray-900 px-[7px]">{service.name}</span>
            </div>
            <span className="text-primary font-semibold">+{t('currency')} {service.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalServices;
