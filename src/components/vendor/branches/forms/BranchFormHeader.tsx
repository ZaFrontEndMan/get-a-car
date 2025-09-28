
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface BranchFormHeaderProps {
  isEditing: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const BranchFormHeader = ({ isEditing, onClose, t }: BranchFormHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{isEditing ? t("editBranch") : t("addNewBranch")}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default BranchFormHeader;
