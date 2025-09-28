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
}

const BranchForm = ({ branch, onClose, onSuccess, t }: BranchFormProps) => {
  const { formData, errors, mutation, handleChange, handleSubmit } =
    useBranchForm(branch, onSuccess);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <BranchFormHeader isEditing={!!branch} onClose={onClose} t={t} />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <BranchFormFields
              formData={formData}
              errors={errors}
              onFieldChange={handleChange}
              t={t}
            />

            <BranchFormActions
              isEditing={!!branch}
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
