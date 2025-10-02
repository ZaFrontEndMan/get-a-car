import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { toast } from 'sonner';

interface HeroSlide {
  id: string;
  title: string;
  title_ar?: string;
  subtitle: string;
  subtitle_ar?: string;
  image_url: string;
  is_active: boolean;
  order_index: number;
  button_text?: string;
  button_text_ar?: string;
  button_url?: string;
  created_at: string;
  updated_at: string;
}

const AdminSliders = () => {
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: slides, isLoading } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as HeroSlide[];
    }
  });

  const createSlideMutation = useMutation({
    mutationFn: async (slideData: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('hero_slides')
        .insert(slideData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      setIsDialogOpen(false);
      setSelectedSlide(null);
      toast.success('Slide created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create slide: ' + error.message);
    }
  });

  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, ...slideData }: Partial<Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>> & { id: string }) => {
      const { data, error } = await supabase
        .from('hero_slides')
        .update(slideData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      setIsDialogOpen(false);
      setSelectedSlide(null);
      toast.success('Slide updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update slide: ' + error.message);
    }
  });

  const deleteSlideMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      toast.success('Slide deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete slide: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const slideData = {
      title: formData.get('title') as string,
      title_ar: formData.get('title_ar') as string || null,
      subtitle: formData.get('subtitle') as string,
      subtitle_ar: formData.get('subtitle_ar') as string || null,
      image_url: formData.get('image_url') as string,
      button_text: formData.get('button_text') as string || null,
      button_text_ar: formData.get('button_text_ar') as string || null,
      button_url: formData.get('button_url') as string || null,
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: formData.get('is_active') === 'on'
    };

    if (selectedSlide) {
      updateSlideMutation.mutate({ id: selectedSlide.id, ...slideData });
    } else {
      createSlideMutation.mutate(slideData);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      deleteSlideMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setSelectedSlide(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading slides...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hero Slider Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedSlide ? 'Edit Slide' : 'Create New Slide'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title (English)</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={selectedSlide?.title || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title_ar">Title (Arabic)</Label>
                  <Input
                    id="title_ar"
                    name="title_ar"
                    defaultValue={selectedSlide?.title_ar || ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subtitle">Subtitle (English)</Label>
                  <Textarea
                    id="subtitle"
                    name="subtitle"
                    defaultValue={selectedSlide?.subtitle || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle_ar">Subtitle (Arabic)</Label>
                  <Textarea
                    id="subtitle_ar"
                    name="subtitle_ar"
                    defaultValue={selectedSlide?.subtitle_ar || ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  defaultValue={selectedSlide?.image_url || ''}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_text">Button Text (English)</Label>
                  <Input
                    id="button_text"
                    name="button_text"
                    defaultValue={selectedSlide?.button_text || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="button_text_ar">Button Text (Arabic)</Label>
                  <Input
                    id="button_text_ar"
                    name="button_text_ar"
                    defaultValue={selectedSlide?.button_text_ar || ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_url">Button URL</Label>
                  <Input
                    id="button_url"
                    name="button_url"
                    defaultValue={selectedSlide?.button_url || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="order_index">Order Index</Label>
                  <Input
                    id="order_index"
                    name="order_index"
                    type="number"
                    defaultValue={selectedSlide?.order_index || 0}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={selectedSlide?.is_active ?? true}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedSlide ? 'Update' : 'Create'} Slide
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {slides?.map((slide) => (
          <Card key={slide.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    {slide.title}
                    {!slide.is_active && (
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded">Inactive</span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(slide)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img 
                  src={slide.image_url} 
                  alt={slide.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <div>
                  <p><strong>Order:</strong> {slide.order_index}</p>
                  {slide.button_text && (
                    <p><strong>Button:</strong> {slide.button_text} → {slide.button_url}</p>
                  )}
                  {slide.title_ar && (
                    <p><strong>Arabic Title:</strong> {slide.title_ar}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSliders;