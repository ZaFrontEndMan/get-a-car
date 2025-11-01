import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBranchForm } from "./branches/forms/useBranchForm";
import BranchFormHeader from "./branches/forms/BranchFormHeader";
import BranchFormFields from "./branches/forms/BranchFormFields";
import BranchFormActions from "./branches/forms/BranchFormActions";

interface BranchFormProps {
  branch?: any;
  onClose: () => void;
  onSuccess: () => void;
  t: any;
  isEditing?: boolean; // Added for conditional rendering
}

const BranchForm = ({
  branch,
  onClose,
  onSuccess,
  t,
  isEditing,
}: BranchFormProps) => {
  const { formData, errors, mutation, handleChange, handleSubmit } =
    useBranchForm(branch, onSuccess, t, isEditing);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <BranchFormHeader isEditing={isEditing} onClose={onClose} t={t} />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <BranchFormFields
              formData={formData}
              errors={errors}
              onFieldChange={handleChange}
              t={t}
              isEditing={isEditing}
            />

            <BranchFormActions
              isEditing={isEditing}
              isLoading={mutation.isPending}
              isUserAuthenticated={true}
              onCancel={onClose}
              t={t}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchForm;
