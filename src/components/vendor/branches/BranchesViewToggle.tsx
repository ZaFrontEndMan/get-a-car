
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, List, Table } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BranchesViewToggleProps {
  currentView: 'grid' | 'list' | 'table';
  onViewChange: (view: 'grid' | 'list' | 'table') => void;
}

const BranchesViewToggle = ({ currentView, onViewChange }: BranchesViewToggleProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <Button
        variant={currentView === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="flex items-center gap-1"
        title={t('gridView')}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="flex items-center gap-1"
        title={t('listView')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="flex items-center gap-1"
        title={t('tableView')}
      >
        <Table className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BranchesViewToggle;
