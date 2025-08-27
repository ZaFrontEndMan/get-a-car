
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserFormProps {
  user?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm = ({ user, onClose, onSuccess }: UserFormProps) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    user_id: '',
    role: 'staff',
    is_active: true,
    permissions: [] as string[]
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  const availablePermissions = [
    'manage_cars',
    'manage_bookings', 
    'manage_branches',
    'view_reports',
    'manage_users'
  ];

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user in UserForm:', user);
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        password: '',
        confirm_password: '',
        user_id: user.user_id || '',
        role: user.role || 'staff',
        is_active: user.is_active,
        permissions: user.permissions || []
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Submitting user data:', data);
      
      if (!currentUser) {
        throw new Error('User not authenticated. Please sign in first.');
      }

      try {
        // First, get the vendor record for the current user
        console.log('Getting vendor record for current user...');
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', currentUser.id)
          .single();

        if (vendorError) {
          console.error('Vendor lookup error:', vendorError);
          if (vendorError.code === 'PGRST116') {
            // Create vendor record if it doesn't exist
            console.log('No vendor record found, creating one...');
            const { data: newVendor, error: createVendorError } = await supabase
              .from('vendors')
              .insert({
                user_id: currentUser.id,
                name: `${currentUser.user_metadata?.first_name || ''} ${currentUser.user_metadata?.last_name || ''}`.trim() || 'Unknown Vendor',
                email: currentUser.email,
                phone: currentUser.user_metadata?.phone || null,
                description: 'Vendor profile created automatically',
                verified: false
              })
              .select()
              .single();

            if (createVendorError) {
              console.error('Error creating vendor:', createVendorError);
              throw new Error('Failed to create vendor profile. Please contact support.');
            }

            vendorData.id = newVendor.id;
            console.log('Vendor record created successfully:', vendorData.id);
          } else {
            throw vendorError;
          }
        }

        const vendorId = vendorData.id;
        console.log('Using vendor ID:', vendorId);

        if (user) {
          // Update existing user
          console.log('Updating user with ID:', user.id);
          const { error } = await supabase
            .from('vendor_users')
            .update({
              role: data.role,
              is_active: data.is_active,
              permissions: data.permissions
            })
            .eq('id', user.id);

          if (error) {
            console.error('Update error:', error);
            throw error;
          }
        } else {
          // For new users, we need to create an auth user first
          if (!data.email || !data.password) {
            throw new Error('Email and password are required for new users');
          }

          if (data.password !== data.confirm_password) {
            throw new Error('Passwords do not match');
          }

          console.log('Creating new auth user...');
          
          // Create auth user with proper metadata to ensure vendor role
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                first_name: data.first_name,
                last_name: data.last_name,
                role: 'vendor',
                user_type: 'vendor'
              }
            }
          });

          if (authError) {
            console.error('Auth signup error:', authError);
            throw authError;
          }

          if (!authData.user) {
            throw new Error('Failed to create user account');
          }

          console.log('Auth user created successfully:', authData.user.id);

          // Wait for the database trigger to process
          console.log('Waiting for profile creation...');
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Check if profile was created with correct role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', authData.user.id)
            .single();

          if (profileError) {
            console.error('Profile check error:', profileError);
            // Create profile manually if trigger didn't work
            const { error: manualProfileError } = await supabase
              .from('profiles')
              .insert({
                user_id: authData.user.id,
                first_name: data.first_name,
                last_name: data.last_name,
                role: 'vendor'
              });

            if (manualProfileError) {
              console.error('Manual profile creation error:', manualProfileError);
              throw new Error('Failed to create user profile');
            }
            console.log('Profile created manually');
          } else {
            console.log('Profile found with role:', profileData.role);
            
            // Ensure the profile has vendor role
            if (profileData.role !== 'vendor') {
              console.log('Updating profile role to vendor...');
              const { error: roleUpdateError } = await supabase
                .from('profiles')
                .update({ role: 'vendor' })
                .eq('user_id', authData.user.id);

              if (roleUpdateError) {
                console.error('Role update error:', roleUpdateError);
                throw new Error('Failed to set user role');
              }
            }
          }

          console.log('Creating vendor user record...');
          // Create vendor user record
          const { error: vendorUserError } = await supabase
            .from('vendor_users')
            .insert({
              vendor_id: vendorId,
              user_id: authData.user.id,
              role: data.role,
              is_active: data.is_active,
              permissions: data.permissions
            });

          if (vendorUserError) {
            console.error('Vendor user creation error:', vendorUserError);
            throw vendorUserError;
          }

          console.log('Vendor user created successfully');
        }
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('User operation successful');
      toast({
        title: "Success",
        description: `User ${user ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('User operation failed:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${user ? 'update' : 'create'} user`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage users",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{user ? 'Edit User' : 'Add New User'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!currentUser && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ You need to be signed in to manage users
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      required
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      required
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm_password">Confirm Password *</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => handleChange('confirm_password', e.target.value)}
                    required
                    minLength={6}
                    placeholder="Confirm password"
                  />
                </div>
              </>
            )}

            {user && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  Editing user: {user.user_id.slice(-8)}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="space-y-2 mt-2">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Switch
                      id={permission}
                      checked={formData.permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionToggle(permission)}
                    />
                    <Label htmlFor={permission} className="text-sm">
                      {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={mutation.isPending || !currentUser}
              >
                {mutation.isPending ? 'Saving...' : (user ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
