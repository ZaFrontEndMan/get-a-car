
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import UserForm from './UserForm';
import { useToast } from '@/hooks/use-toast';

const VendorUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  React.useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user in VendorUsers:', user);
      setCurrentUser(user);
    };
    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user);
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Query to get vendor users for the authenticated user's vendor account
  const { data: vendorUsers, isLoading, error } = useQuery({
    queryKey: ['vendor-users', currentUser?.id],
    queryFn: async () => {
      console.log('Fetching vendor users for user:', currentUser?.id);
      
      if (!currentUser) {
        console.log('No user authenticated, returning empty array');
        return [];
      }

      try {
        // First get the vendor record for this user
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', currentUser.id)
          .single();

        if (vendorError) {
          console.error('Vendor lookup error:', vendorError);
          if (vendorError.code === 'PGRST116') {
            console.log('No vendor record found for user');
            return [];
          }
          throw vendorError;
        }

        console.log('Found vendor:', vendorData.id);

        // Now fetch vendor users for this vendor
        const { data, error } = await supabase
          .from('vendor_users')
          .select('*')
          .eq('vendor_id', vendorData.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Vendor users fetch error:', error);
          throw error;
        }

        console.log('Vendor users fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching vendor users:', error);
        throw error;
      }
    },
    enabled: !!currentUser,
    retry: 1,
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting vendor user:', userId);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('vendor_users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Vendor user deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['vendor-users'] });
      toast({
        title: "Success",
        description: "User removed successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove user",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (user: any) => {
    console.log('Editing user:', user);
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      deleteMutation.mutate(userId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleAddUser = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add users",
        variant: "destructive",
      });
      return;
    }
    setShowForm(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissions = (permissions: any): string[] => {
    if (Array.isArray(permissions)) {
      return permissions;
    }
    if (typeof permissions === 'string') {
      try {
        const parsed = JSON.parse(permissions);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    console.error('Users error:', error);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Users</h2>
          <Button onClick={handleAddUser} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading users</h3>
            <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Users</h2>
        <Button onClick={handleAddUser} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      {!currentUser && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">Please sign in to manage users</p>
          </CardContent>
        </Card>
      )}

      {currentUser && (!vendorUsers || vendorUsers.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-600 mb-4">Add team members to help manage your vendor account</p>
            <Button onClick={handleAddUser}>Add First User</Button>
          </CardContent>
        </Card>
      )}

      {currentUser && vendorUsers && vendorUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendorUsers.map((user) => {
            const userPermissions = getPermissions(user.permissions);
            
            return (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">User #{user.user_id.slice(-8)}</CardTitle>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  {userPermissions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {userPermissions.map((permission: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Added: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['vendor-users'] });
            handleFormClose();
          }}
        />
      )}
    </div>
  );
};

export default VendorUsers;
