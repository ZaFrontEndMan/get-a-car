import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Branch } from './types';

interface VendorBranchesTableProps {
  branches: Branch[];
}

export const VendorBranchesTable: React.FC<VendorBranchesTableProps> = ({ branches }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Locations</CardTitle>
        <CardDescription>All branch locations for this vendor</CardDescription>
      </CardHeader>
      <CardContent>
        {branches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No branches found for this vendor
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map(branch => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div className="font-medium">{branch.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{branch.city}</div>
                      <div className="text-sm text-gray-500">{branch.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {branch.manager_name || 'Not assigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {branch.phone || 'No phone'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={branch.is_active ? "default" : "secondary"}>
                      {branch.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(branch.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};