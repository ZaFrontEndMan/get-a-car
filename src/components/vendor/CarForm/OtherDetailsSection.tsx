
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OtherDetailsSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  branches?: Array<{ id: string; name: string }>;
  branchesLoading?: boolean;
}

const OtherDetailsSection = ({ formData, handleChange, branches, branchesLoading }: OtherDetailsSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Other Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mileage_limit">Daily Mileage Limit (KM)</Label>
          <Input
            id="mileage_limit"
            type="number"
            value={formData.mileage_limit}
            onChange={(e) => handleChange('mileage_limit', parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="branch_id">Branch</Label>
          <Select 
            value={formData.branch_id || 'no-branch'} 
            onValueChange={(value) => handleChange('branch_id', value === 'no-branch' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                branchesLoading ? "Loading branches..." : 
                !branches || branches.length === 0 ? "No branches available" : 
                "Select branch"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-branch">No branch</SelectItem>
              {branches?.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Switch
            id="is_available"
            checked={formData.is_available}
            onCheckedChange={(checked) => handleChange('is_available', checked)}
          />
          <Label htmlFor="is_available">Available</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => handleChange('is_featured', checked)}
          />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>
    </div>
  );
};

export default OtherDetailsSection;
