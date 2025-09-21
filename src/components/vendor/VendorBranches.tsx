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

const VendorBranches = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [currentView, setCurrentView] = useState<"grid" | "list" | "table">(
    "table"
  );

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, error } = useGetVendorBranches();

  const branches = useMemo(() => {
    const raw =
      (data as any)?.data?.vendorBranches ||
      (data as any)?.vendorBranches ||
      (data as any)?.data?.data?.branches ||
      (data as any)?.data?.branches ||
      (data as any)?.branches ||
      (data as any)?.data ||
      [];

    return (raw as any[]).map((b) => ({
      id: (b?.id ?? "").toString(),
      name: b?.branchName ?? b?.name ?? "Branch",
      address: b?.address ?? b?.streetAddress ?? "",
      city: b?.city ?? b?.location ?? "",
      phone: b?.branchPhoneNumber ?? b?.phone ?? b?.phoneNumber ?? "",
      email: b?.email ?? "",
      manager_name: b?.fullName ?? b?.manager_name ?? b?.managerName ?? "",
      is_active:
        typeof b?.is_active === "boolean"
          ? b.is_active
          : typeof b?.isActive === "boolean"
          ? b.isActive
          : true,
      created_at:
        b?.creationDate ??
        b?.created_at ??
        b?.createdAt ??
        b?.createdOn ??
        new Date().toISOString(),
    }));
  }, [data]);

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

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
    // Creation endpoint not available yet; prevent opening the form
    toast({
      title: "Coming soon",
      description: "Branch creation is not available yet.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading branches...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Branches</h2>
        <div className=" flex gap-4">
          {branches && branches.length > 0 && (
            <BranchesViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          )}
          <Button onClick={onAddBranch} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Branch</span>
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
          branch={editingBranch}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default VendorBranches;
