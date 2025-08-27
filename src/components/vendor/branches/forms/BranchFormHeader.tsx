
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface BranchFormHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

const BranchFormHeader = ({ isEditing, onClose }: BranchFormHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{isEditing ? 'Edit Branch' : 'Add New Branch'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default BranchFormHeader;
