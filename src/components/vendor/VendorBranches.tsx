
import React, { useState } from 'react';
import BranchForm from './BranchForm';
import BranchCard from './branches/BranchCard';
import EmptyBranchesState from './branches/EmptyBranchesState';
import BranchesHeader from './branches/BranchesHeader';
import BranchesViewToggle from './branches/BranchesViewToggle';
import BranchesListView from './branches/BranchesListView';
import BranchesTableView from './branches/BranchesTableView';
import { useBranches } from './branches/useBranches';

const VendorBranches = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'table'>('grid');
  
  const {
    currentUser,
    branches,
    isLoading,
    error,
    deleteMutation,
    handleAddBranch,
    refreshBranches
  } = useBranches();

  const handleEdit = (branch: any) => {
    console.log('Editing branch:', branch);
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleDelete = (branchId: string) => {
    deleteMutation.mutate(branchId);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBranch(null);
  };

  const handleFormSuccess = () => {
    refreshBranches();
    handleFormClose();
  };

  const onAddBranch = () => {
    if (handleAddBranch()) {
      setShowForm(true);
    }
  };

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <BranchesHeader onAddBranch={onAddBranch} />
        <EmptyBranchesState type="no-auth" />
      </div>
    );
  }

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
        <BranchesHeader onAddBranch={onAddBranch} />
        {branches && branches.length > 0 && (
          <BranchesViewToggle 
            currentView={currentView} 
            onViewChange={setCurrentView} 
          />
        )}
      </div>

      {error && (
        <EmptyBranchesState 
          type="error" 
          error={error.message} 
        />
      )}

      {!error && (!branches || branches.length === 0) ? (
        <EmptyBranchesState 
          type="empty" 
          currentUser={currentUser}
          onAddBranch={onAddBranch}
        />
      ) : (
        !error && branches && branches.length > 0 && (
          <>
            {currentView === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            )}
            
            {currentView === 'list' && (
              <BranchesListView
                branches={branches}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            )}
            
            {currentView === 'table' && (
              <BranchesTableView
                branches={branches}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
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
