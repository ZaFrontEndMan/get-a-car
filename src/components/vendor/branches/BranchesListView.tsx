
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MapPin, User, Phone, Mail } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  manager_name?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  created_at: string;
}

interface BranchesListViewProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (branchId: string) => void;
  isDeleting: boolean;
}

const BranchesListView = ({ branches, onEdit, onDelete, isDeleting }: BranchesListViewProps) => {
  return (
    <div className="space-y-4">
      {branches.map((branch) => (
        <Card key={branch.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold">{branch.name}</h3>
                  <Badge variant={branch.is_active ? "default" : "secondary"}>
                    {branch.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{branch.city}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-600">{branch.address}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {branch.manager_name && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{branch.manager_name}</span>
                      </div>
                    )}
                    {branch.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{branch.phone}</span>
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{branch.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(branch.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(branch)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(branch.id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BranchesListView;
