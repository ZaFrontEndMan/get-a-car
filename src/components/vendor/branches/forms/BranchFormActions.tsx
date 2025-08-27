
import React from 'react';
import { Button } from '@/components/ui/button';

interface BranchFormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  isUserAuthenticated: boolean;
  onCancel: () => void;
}

const BranchFormActions = ({ 
  isEditing, 
  isLoading, 
  isUserAuthenticated, 
  onCancel 
}: BranchFormActionsProps) => {
  return (
    <div className="flex space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="flex-1"
        disabled={isLoading || !isUserAuthenticated}
      >
        {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
      </Button>
    </div>
  );
};

export default BranchFormActions;
