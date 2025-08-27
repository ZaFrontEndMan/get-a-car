
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface BranchFormFieldsProps {
  formData: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    manager_name: string;
    is_active: boolean;
  };
  onFieldChange: (field: string, value: any) => void;
}

const BranchFormFields = ({ formData, onFieldChange }: BranchFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Branch Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          required
          placeholder="Enter branch name"
        />
      </div>

      <div>
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          required
          placeholder="Enter address"
        />
      </div>

      <div>
        <Label htmlFor="city">City *</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => onFieldChange('city', e.target.value)}
          required
          placeholder="Enter city"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          placeholder="Enter email address"
        />
      </div>

      <div>
        <Label htmlFor="manager_name">Manager Name</Label>
        <Input
          id="manager_name"
          value={formData.manager_name}
          onChange={(e) => onFieldChange('manager_name', e.target.value)}
          placeholder="Enter manager name"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => onFieldChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
    </>
  );
};

export default BranchFormFields;
