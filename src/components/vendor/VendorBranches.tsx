import React, { useMemo, useState } from "react";
import BranchForm from "./BranchForm";
import BranchCard from "./branches/BranchCard";
import EmptyBranchesState from "./branches/EmptyBranchesState";
import BranchesViewToggle from "./branches/BranchesViewToggle";
import BranchesListView from "./branches/BranchesListView";
import BranchesTableView from "./branches/BranchesTableView";
import { useGetVendorBranches } from "@/hooks/vendor/useVendorBranch";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const VendorBranches = () => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [currentView, setCurrentView] = useState<"grid" | "list" | "table">(
    "table"
  );

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, error } = useGetVendorBranches();
  const branches = data?.data?.vendorBranches;

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  console.log(data);

  const handleDelete = (branchId: string) => {
    toast({
      title: "Not available",
      description: "Branch deletion is not available at the moment.",
    });
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBranch(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["vendor", "branches"] });
    handleFormClose();
  };

  const onAddBranch = () => {
    // Now we can open the form for creation
    setEditingBranch(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="me-2">{t("loadingData")}</span>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">{t("branches")}</h2>
        <div className=" flex gap-4">
          {branches && branches.length > 0 && (
            <BranchesViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          )}
          <Button onClick={onAddBranch} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>{t("addNewBranch")}</span>
          </Button>
        </div>
      </div>

      {error && (
        <EmptyBranchesState type="error" error={(error as any)?.message} />
      )}

      {!error && (!branches || branches.length === 0) ? (
        <EmptyBranchesState type="empty" onAddBranch={onAddBranch} />
      ) : (
        !error &&
        branches &&
        branches.length > 0 && (
          <>
            {currentView === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                  <BranchCard
                    t={t}
                    key={branch.id}
                    branch={branch}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={false}
                  />
                ))}
              </div>
            )}

            {currentView === "list" && (
              <BranchesListView
                t={t}
                branches={branches}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={false}
              />
            )}

            {currentView === "table" && (
              <BranchesTableView
                branches={branches}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={false}
              />
            )}
          </>
        )
      )}

      {showForm && (
        <BranchForm
          t={t}
          branch={editingBranch}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          isEditing={!!editingBranch}
        />
      )}
    </div>
  );
};

export default VendorBranches;
