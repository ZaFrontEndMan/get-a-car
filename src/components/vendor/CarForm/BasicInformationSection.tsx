
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInformationSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const BasicInformationSection = ({ formData, handleChange }: BasicInformationSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Car Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            min="2000"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select car type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="convertible">Convertible</SelectItem>
              <SelectItem value="wagon">Wagon</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fuel_type">Fuel Type *</Label>
          <Select value={formData.fuel_type} onValueChange={(value) => handleChange('fuel_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="transmission">Transmission *</Label>
          <Select value={formData.transmission} onValueChange={(value) => handleChange('transmission', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="seats">Seats *</Label>
          <Input
            id="seats"
            type="number"
            value={formData.seats}
            onChange={(e) => handleChange('seats', parseInt(e.target.value))}
            min="2"
            max="8"
            required
          />
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="license_plate">License Plate</Label>
          <Input
            id="license_plate"
            value={formData.license_plate}
            onChange={(e) => handleChange('license_plate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
