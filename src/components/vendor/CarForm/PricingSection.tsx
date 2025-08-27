
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PricingSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const PricingSection = ({ formData, handleChange }: PricingSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Pricing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="daily_rate">Daily Rate (SAR) *</Label>
          <Input
            id="daily_rate"
            type="number"
            step="0.01"
            value={formData.daily_rate}
            onChange={(e) => handleChange('daily_rate', parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="weekly_rate">Weekly Rate (SAR)</Label>
          <Input
            id="weekly_rate"
            type="number"
            step="0.01"
            value={formData.weekly_rate}
            onChange={(e) => handleChange('weekly_rate', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="monthly_rate">Monthly Rate (SAR)</Label>
          <Input
            id="monthly_rate"
            type="number"
            step="0.01"
            value={formData.monthly_rate}
            onChange={(e) => handleChange('monthly_rate', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="deposit_amount">Deposit Amount (SAR)</Label>
          <Input
            id="deposit_amount"
            type="number"
            step="0.01"
            value={formData.deposit_amount}
            onChange={(e) => handleChange('deposit_amount', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
