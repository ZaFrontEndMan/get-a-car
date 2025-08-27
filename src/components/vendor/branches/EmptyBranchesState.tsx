
import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyBranchesStateProps {
  type: 'no-auth' | 'error' | 'empty';
  error?: string;
  onAddBranch?: () => void;
  currentUser?: any;
}

const EmptyBranchesState = ({ type, error, onAddBranch, currentUser }: EmptyBranchesStateProps) => {
  if (type === 'no-auth') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-orange-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please sign in to manage your branches</p>
          <Button onClick={() => window.location.href = '/sign-in'}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (type === 'error') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading branches</h3>
          <p className="text-gray-600 mb-4">
            {error || "There was an error loading your branches"}
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
        <p className="text-gray-600 mb-4">
          {currentUser 
            ? "You don't have any branches yet. Contact support to set up your vendor account."
            : "Please sign in to view your branches"
          }
        </p>
        <Button onClick={onAddBranch}>Add Your First Branch</Button>
      </CardContent>
    </Card>
  );
};

export default EmptyBranchesState;
