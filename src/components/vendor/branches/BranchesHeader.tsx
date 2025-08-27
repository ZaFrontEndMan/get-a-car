
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BranchesHeaderProps {
  onAddBranch: () => void;
}

const BranchesHeader = ({ onAddBranch }: BranchesHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-900">Branches</h2>
      <Button onClick={onAddBranch} className="flex items-center space-x-2">
        <Plus className="h-4 w-4" />
        <span>Add Branch</span>
      </Button>
    </div>
  );
};

export default BranchesHeader;
