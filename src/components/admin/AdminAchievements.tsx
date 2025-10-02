import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trophy, Edit, Trash2, Plus, Users, Car, Calendar, MapPin } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  icon: string;
  value: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AchievementFormData {
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  icon: string;
  value: string;
  order_index: number;
  is_active: boolean;
}

const AdminAchievements = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState<AchievementFormData>({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    icon: 'trophy',
    value: '',
    order_index: 0,
    is_active: true
  });

  const queryClient = useQueryClient();

  // Fetch achievements
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data as Achievement[];
    }
  });

  // Create achievement mutation
  const createMutation = useMutation({
    mutationFn: async (data: AchievementFormData) => {
      const { error } = await supabase
        .from('achievements')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success('Achievement created successfully!');
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Failed to create achievement: ' + error.message);
    }
  });

  // Update achievement mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AchievementFormData }) => {
      const { error } = await supabase
        .from('achievements')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success('Achievement updated successfully!');
      setEditingAchievement(null);
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Failed to update achievement: ' + error.message);
    }
  });

  // Delete achievement mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success('Achievement deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete achievement: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      title_ar: '',
      description: '',
      description_ar: '',
      icon: 'trophy',
      value: '',
      order_index: 0,
      is_active: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAchievement) {
      updateMutation.mutate({ id: editingAchievement.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      title_ar: achievement.title_ar || '',
      description: achievement.description,
      description_ar: achievement.description_ar || '',
      icon: achievement.icon,
      value: achievement.value,
      order_index: achievement.order_index,
      is_active: achievement.is_active
    });
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      users: Users,
      car: Car,
      calendar: Calendar,
      'map-pin': MapPin
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Trophy;
    return <IconComponent className="h-5 w-5" />;
  };

  if (isLoading) {
    return <div>Loading achievements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Achievements Management</h2>
          <p className="text-gray-600">Manage website achievements and statistics</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {resetForm(); setEditingAchievement(null);}}>
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
              </DialogTitle>
              <DialogDescription>
                Create or edit achievement information for the website.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="arabic">Arabic</TabsTrigger>
                </TabsList>
                
                <TabsContent value="english" className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="arabic" className="space-y-4">
                  <div>
                    <Label htmlFor="title_ar">Title (Arabic)</Label>
                    <Input
                      id="title_ar"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_ar">Description (Arabic)</Label>
                    <Textarea
                      id="description_ar"
                      value={formData.description_ar}
                      onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    placeholder="e.g., 50,000+"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="trophy">Trophy</option>
                    <option value="users">Users</option>
                    <option value="car">Car</option>
                    <option value="calendar">Calendar</option>
                    <option value="map-pin">Map Pin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order_index">Order</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingAchievement ? 'Update' : 'Create'} Achievement
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements List</CardTitle>
          <CardDescription>
            Manage all achievements displayed on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievements?.map((achievement) => (
                <TableRow key={achievement.id}>
                  <TableCell>
                    {getIconComponent(achievement.icon)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      {achievement.title_ar && (
                        <div className="text-sm text-gray-500" dir="rtl">{achievement.title_ar}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{achievement.value}</TableCell>
                  <TableCell>{achievement.order_index}</TableCell>
                  <TableCell>
                    <Badge variant={achievement.is_active ? "default" : "secondary"}>
                      {achievement.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleEdit(achievement);
                          setIsAddModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this achievement?')) {
                            deleteMutation.mutate(achievement.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAchievements;
