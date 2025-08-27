
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useBranchForm } from './branches/forms/useBranchForm';
import BranchFormHeader from './branches/forms/BranchFormHeader';
import BranchFormFields from './branches/forms/BranchFormFields';
import BranchFormActions from './branches/forms/BranchFormActions';

interface BranchFormProps {
  branch?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const BranchForm = ({ branch, onClose, onSuccess }: BranchFormProps) => {
  const {
    formData,
    currentUser,
    mutation,
    handleChange,
    handleSubmit
  } = useBranchForm(branch, onSuccess);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <BranchFormHeader 
          isEditing={!!branch} 
          onClose={onClose} 
        />
        <CardContent>
          {!currentUser && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ You need to be signed in to create branches
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <BranchFormFields 
              formData={formData}
              onFieldChange={handleChange}
            />

            <BranchFormActions
              isEditing={!!branch}
              isLoading={mutation.isPending}
              isUserAuthenticated={!!currentUser}
              onCancel={onClose}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchForm;
