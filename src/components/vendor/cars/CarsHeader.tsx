
import React from 'react';
import { Plus, Grid3X3, List, Table, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarsHeaderProps {
  viewMode: 'grid' | 'list' | 'table';
  onViewModeChange: (mode: 'grid' | 'list' | 'table') => void;
  onAddCar: () => void;
  onImportCars?: () => void;
}

const CarsHeader = ({ viewMode, onViewModeChange, onAddCar, onImportCars }: CarsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-900">Cars</h2>
      <div className="flex items-center space-x-4">
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Import Button */}
        {onImportCars && (
          <Button 
            onClick={onImportCars} 
            variant="outline"
            className="flex items-center space-x-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Import Excel</span>
          </Button>
        )}
        
        {/* Add Car Button */}
        <Button onClick={onAddCar} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Car</span>
        </Button>
      </div>
    </div>
  );
};

export default CarsHeader;
