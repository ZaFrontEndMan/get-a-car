
import React from 'react';
import { Button } from '@/components/ui/button';

interface BranchFormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  isUserAuthenticated: boolean;
  onCancel: () => void;
  t: (key: string) => string;
}

const BranchFormActions = ({ 
  isEditing, 
  isLoading, 
  isUserAuthenticated, 
  onCancel,
  t
}: BranchFormActionsProps) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
        {t("cancelButton")}
      </Button>
      <Button 
        type="submit" 
        className="flex-1"
        disabled={isLoading || !isUserAuthenticated}
      >
        {isLoading ? t("savingButton") : (isEditing ? t("updateButton") : t("createButton"))}
      </Button>
    </div>
  );
};

export default BranchFormActions;
