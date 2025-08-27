
import React from 'react';
import { Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BranchCardProps {
  branch: {
    id: string;
    name: string;
    address: string;
    city: string;
    phone?: string;
    email?: string;
    manager_name?: string;
    is_active: boolean;
  };
  onEdit: (branch: any) => void;
  onDelete: (branchId: string) => void;
  isDeleting: boolean;
}

const BranchCard = ({ branch, onEdit, onDelete, isDeleting }: BranchCardProps) => {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this branch?')) {
      onDelete(branch.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{branch.name}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(branch)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-900">{branch.address}</p>
            <p className="text-sm text-gray-600">{branch.city}</p>
          </div>
        </div>
        
        {branch.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-900">{branch.phone}</span>
          </div>
        )}
        
        {branch.email && (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-900">{branch.email}</span>
          </div>
        )}
        
        {branch.manager_name && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">Manager: {branch.manager_name}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            branch.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {branch.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchCard;
