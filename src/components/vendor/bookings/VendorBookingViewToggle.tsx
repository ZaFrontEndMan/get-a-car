import React from 'react';
import { Grid3X3, List, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VendorBookingViewToggleProps {
  viewMode: 'grid' | 'list' | 'table';
  onViewModeChange: (mode: 'grid' | 'list' | 'table') => void;
}

const VendorBookingViewToggle = ({ viewMode, onViewModeChange }: VendorBookingViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="px-3 py-2"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="px-3 py-2"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className="px-3 py-2"
      >
        <Table className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VendorBookingViewToggle;