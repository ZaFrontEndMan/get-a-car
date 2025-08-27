
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { VendorDetails } from './types';

interface AdminControlsCardProps {
  vendor: VendorDetails;
  onSwitchChange: (field: string, value: boolean) => void;
}

export const AdminControlsCard: React.FC<AdminControlsCardProps> = ({ vendor, onSwitchChange }) => {
  const handleSwitchChange = (field: string, checked: boolean) => {
    console.log(`Switch change: ${field} = ${checked}`);
    onSwitchChange(field, checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Controls</CardTitle>
        <CardDescription>Manage vendor permissions and visibility</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Vendor Verified</p>
              <p className="text-xs text-muted-foreground">
                When enabled, vendor will display as verified with badge
              </p>
            </div>
            <Switch
              checked={vendor.verified ?? false}
              onCheckedChange={(checked) => handleSwitchChange('verified', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Vendor Active</p>
              <p className="text-xs text-muted-foreground">
                When disabled, vendor cannot login to dashboard
              </p>
            </div>
            <Switch
              checked={vendor.is_active ?? false}
              onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Show on Website</p>
              <p className="text-xs text-muted-foreground">
                When disabled, vendor and their cars won't be shown on website
              </p>
            </div>
            <Switch
              checked={vendor.show_on_website ?? false}
              onCheckedChange={(checked) => handleSwitchChange('show_on_website', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Can Create Offers</p>
              <p className="text-xs text-muted-foreground">
                When disabled, vendor cannot create promotional offers
              </p>
            </div>
            <Switch
              checked={vendor.can_create_offers ?? false}
              onCheckedChange={(checked) => handleSwitchChange('can_create_offers', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
