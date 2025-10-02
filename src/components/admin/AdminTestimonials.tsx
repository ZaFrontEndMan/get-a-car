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
import { MessageSquare, Edit, Trash2, Plus, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  name_ar?: string;
  location?: string;
  location_ar?: string;
  rating: number;
  comment: string;
  comment_ar?: string;
  avatar_url?: string;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface TestimonialFormData {
  name: string;
  name_ar: string;
  location: string;
  location_ar: string;
  rating: number;
  comment: string;
  comment_ar: string;
  avatar_url: string;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
}

const AdminTestimonials = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    name_ar: '',
    location: '',
    location_ar: '',
    rating: 5,
    comment: '',
    comment_ar: '',
    avatar_url: '',
    is_featured: false,
    is_active: true,
    order_index: 0
  });

  const queryClient = useQueryClient();

  // Fetch testimonials
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data as Testimonial[];
    }
  });

  // Create testimonial mutation
  const createMutation = useMutation({
    mutationFn: async (data: TestimonialFormData) => {
      const { error } = await supabase
        .from('testimonials')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial created successfully!');
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Failed to create testimonial: ' + error.message);
    }
  });

  // Update testimonial mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TestimonialFormData }) => {
      const { error } = await supabase
        .from('testimonials')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully!');
      setEditingTestimonial(null);
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Failed to update testimonial: ' + error.message);
    }
  });

  // Delete testimonial mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete testimonial: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      location: '',
      location_ar: '',
      rating: 5,
      comment: '',
      comment_ar: '',
      avatar_url: '',
      is_featured: false,
      is_active: true,
      order_index: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      name_ar: testimonial.name_ar || '',
      location: testimonial.location || '',
      location_ar: testimonial.location_ar || '',
      rating: testimonial.rating,
      comment: testimonial.comment,
      comment_ar: testimonial.comment_ar || '',
      avatar_url: testimonial.avatar_url || '',
      is_featured: testimonial.is_featured,
      is_active: testimonial.is_active,
      order_index: testimonial.order_index
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return <div>Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Testimonials Management</h2>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {resetForm(); setEditingTestimonial(null);}}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
              <DialogDescription>
                Create or edit customer testimonial information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="arabic">Arabic</TabsTrigger>
                </TabsList>
                
                <TabsContent value="english" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      required
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="arabic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name_ar">Name (Arabic)</Label>
                      <Input
                        id="name_ar"
                        value={formData.name_ar}
                        onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location_ar">Location (Arabic)</Label>
                      <Input
                        id="location_ar"
                        value={formData.location_ar}
                        onChange={(e) => setFormData({...formData, location_ar: e.target.value})}
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment_ar">Comment (Arabic)</Label>
                    <Textarea
                      id="comment_ar"
                      value={formData.comment_ar}
                      onChange={(e) => setFormData({...formData, comment_ar: e.target.value})}
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="order_index">Order</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
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
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingTestimonial ? 'Update' : 'Create'} Testimonial
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testimonials List</CardTitle>
          <CardDescription>
            Manage all customer testimonials displayed on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials?.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {testimonial.avatar_url && (
                        <img 
                          src={testimonial.avatar_url} 
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        {testimonial.name_ar && (
                          <div className="text-sm text-gray-500" dir="rtl">{testimonial.name_ar}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {renderStars(testimonial.rating)}
                      <span className="ml-2 text-sm">{testimonial.rating}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {testimonial.location}
                      {testimonial.location_ar && (
                        <div className="text-sm text-gray-500" dir="rtl">{testimonial.location_ar}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={testimonial.comment}>
                      {testimonial.comment}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                        {testimonial.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {testimonial.is_featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleEdit(testimonial);
                          setIsAddModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this testimonial?')) {
                            deleteMutation.mutate(testimonial.id);
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

export default AdminTestimonials;
