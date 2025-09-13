
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Percent, Globe, FileText } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGetAllCarOffers, useCreateCarOffer, useEditCarOffer, useDeleteCarOffer } from '@/hooks/vendor/useVendorCarOffer';
import { useGetAllCars } from '@/hooks/vendor/useVendorCar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Offer {
  id: string;
  vendor_id?: string;
  car_id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  discount_percentage: number;
  valid_until: string;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
  car?: {
    name: string;
    brand: string;
    model: string;
    daily_rate: number;
  };
}

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  daily_rate: number;
}

const VendorOffers = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [formData, setFormData] = useState({
    car_id: '',
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    discount_percentage: 0,
    valid_until: '',
    status: 'draft' as 'draft' | 'published'
  });

  const queryClient = useQueryClient();

  // Fetch cars via API hook
  const { data: carsData, isLoading: carsLoading, error: carsError } = useGetAllCars();

  const cars: Car[] = useMemo(() => {
    const d: any = carsData as any;
    const rawList =
      d?.data?.data?.vendorCars ||
      d?.data?.vendorCars ||
      d?.vendorCars ||
      d?.data ||
      d || [];

    const list = Array.isArray(rawList) ? rawList : [];

    return list.map((c: any) => ({
      id: String(c?.id ?? ''),
      name: c?.name ?? '',
      brand: c?.model ? String(c.model).split(' ')[0] : (c?.brand ?? ''),
      model: c?.model ?? '',
      daily_rate: c?.pricePerDay ?? c?.daily_rate ?? 0,
    }));
  }, [carsData]);

  // Get selected car's pricing info
  const selectedCar = cars.find(car => car.id === selectedCarId);
  const originalPrice = selectedCar?.daily_rate || 0;
  const discountedPrice = originalPrice * (1 - (Number(formData.discount_percentage) || 0) / 100);

  // Fetch vendor's offers via API hook
  const { data: offersData, isLoading: offersLoading, error: offersError } = useGetAllCarOffers();
  
  const offers: Offer[] = useMemo(() => {
    const d: any = offersData as any;
    const arr = d?.data || d?.offers || d?.data?.data || [];
    const list = Array.isArray(arr) ? arr : [];
    return list.map((o: any) => ({
      id: String(o?.id ?? ''),
      car_id: String(o?.carId ?? o?.carID ?? ''),
      title: o?.titleEn ?? o?.title ?? '',
      title_ar: o?.titleAr ?? '',
      description: o?.descriptionEr ?? o?.description ?? '',
      description_ar: o?.descriptionAr ?? '',
      discount_percentage: 0,
      valid_until: o?.endDate ?? '',
      status: o?.isActive ? 'published' : 'draft',
    }));
  }, [offersData]);

  // Create/Edit/Delete mutations via API hooks
  const createMutation = useCreateCarOffer();
  const editMutation = useEditCarOffer();
  const deleteMutation = useDeleteCarOffer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append('TitleAr', formData.title_ar || '');
      fd.append('TitleEn', formData.title || '');
      fd.append('DescriptionAr', formData.description_ar || '');
      fd.append('DescriptionEr', formData.description || '');
      fd.append('totalPrice', String(discountedPrice || 0));
      const nowIso = new Date().toISOString();
      const toIso = formData.valid_until ? new Date(formData.valid_until).toISOString() : nowIso;
      fd.append('from', nowIso);
      fd.append('to', toIso);
      fd.append('isActive', String(formData.status === 'published'));
      fd.append('carID', formData.car_id || selectedCarId || '');
      fd.append('pickUpLocationID', String(0));
      // NOTE: offerImage can be appended here if UI provides a file input
      if (editingOffer?.id) {
        fd.append('id', String(editingOffer.id));
        editMutation.mutate(fd, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'carOffers'] });
            toast.success('Offer updated successfully!');
            handleCloseModal();
          },
          onError: (error: any) => {
            toast.error('Failed to update offer: ' + (error?.message || 'Unknown error'));
          },
        });
      } else {
        createMutation.mutate(fd, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'carOffers'] });
            toast.success('Offer created successfully!');
            handleCloseModal();
          },
          onError: (error: any) => {
            toast.error('Failed to create offer: ' + (error?.message || 'Unknown error'));
          },
        });
      }
    } catch (error: any) {
      toast.error('Failed to save offer: ' + (error?.message || 'Unknown error'));
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setSelectedCarId(offer.car_id);
    setFormData({
      car_id: offer.car_id,
      title: offer.title,
      title_ar: offer.title_ar || '',
      description: offer.description,
      description_ar: offer.description_ar || '',
      discount_percentage: offer.discount_percentage,
      valid_until: offer.valid_until ? offer.valid_until.split('T')[0] : '',
      status: offer.status,
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = (offerId: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      deleteMutation.mutate(offerId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['vendor', 'carOffers'] });
          toast.success('Offer deleted successfully!');
        },
        onError: (error: any) => {
          toast.error('Failed to delete offer: ' + (error?.message || 'Unknown error'));
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingOffer(null);
    setSelectedCarId('');
    setFormData({
      car_id: '',
      title: '',
      title_ar: '',
      description: '',
      description_ar: '',
      discount_percentage: 0,
      valid_until: '',
      status: 'draft'
    });
  };

  const handleCarSelect = (carId: string) => {
    setSelectedCarId(carId);
    setFormData({...formData, car_id: carId});
  };

  // Show loading state for cars
  if (carsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Show error state for cars
  if (carsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading cars: {(carsError as any)?.message || 'Unknown error'}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['vendor', 'cars'] })} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Offers Management</h2>
          <p className="text-gray-600">Create and manage special offers for your cars</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {isCreateModalOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</CardTitle>
            <CardDescription>Fill in the details for your special offer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="car_id">Select Car</Label>
                {cars.length === 0 ? (
                  <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                    No cars available. Please add cars first before creating offers.
                  </div>
                ) : (
                  <Select value={formData.car_id} onValueChange={handleCarSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a car" />
                    </SelectTrigger>
                    <SelectContent>
                      {cars.map((car) => (
                        <SelectItem key={car.id} value={car.id}>
                          {car.brand} {car.model} - {car.name} (SAR {car.daily_rate}/day)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedCar && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Pricing Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Original Price:</span>
                      <span className="font-medium ml-2">SAR {originalPrice}/day</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Discounted Price:</span>
                      <span className="font-medium ml-2 text-green-600">SAR {discountedPrice.toFixed(2)}/day</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Offer Title (English)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Weekend Special Deal"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar">Offer Title (Arabic)</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                    placeholder="عرض خاص لعطلة نهاية الأسبوع"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description (English)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your special offer..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_ar">Description (Arabic)</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                    placeholder="وصف العرض الخاص..."
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Discount Percentage</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({...formData, discount_percentage: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valid_until">Valid Until</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={createMutation.isPending || editMutation.isPending || cars.length === 0}>
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{offer.title}</h3>
                    <Badge variant={offer.status === 'published' ? 'default' : 'secondary'}>
                      {offer.status === 'published' ? (
                        <>
                          <Globe className="mr-1 h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <FileText className="mr-1 h-3 w-3" />
                          Draft
                        </>
                      )}
                    </Badge>
                  </div>
                  {offer.title_ar && (
                    <p className="text-sm text-gray-500 mb-2" dir="rtl">{offer.title_ar}</p>
                  )}
                  <p className="text-gray-600 mb-2">{offer.description}</p>
                  {offer.description_ar && (
                    <p className="text-gray-600 mb-2 text-sm" dir="rtl">{offer.description_ar}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Percent className="mr-1 h-3 w-3" />
                      {offer.discount_percentage}% off
                    </span>
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Valid until {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : '—'}
                    </span>
                    {offer.car && (
                      <span>Car: {offer.car.brand} {offer.car.model} (SAR {offer.car.daily_rate}/day)</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(offer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(offer.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorOffers;
