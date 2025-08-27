
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Shield, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface VendorPolicy {
  id: string;
  title_en: string;
  title_ar?: string;
  description_en: string;
  description_ar?: string;
  policy_type: string;
  is_active: boolean;
  order_index: number;
}

const VendorPolicies = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<VendorPolicy | null>(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    policy_type: 'general',
    is_active: true,
    order_index: 0
  });

  // Fetch vendor policies
  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['vendor-policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_policies')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Create/Update policy mutation
  const policyMutation = useMutation({
    mutationFn: async (policy: Partial<VendorPolicy>) => {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!vendor) throw new Error('Vendor not found');

      // Ensure required fields are present and properly typed
      const policyData = {
        title_en: policy.title_en || '',
        title_ar: policy.title_ar || null,
        description_en: policy.description_en || '',
        description_ar: policy.description_ar || null,
        policy_type: policy.policy_type || 'general',
        is_active: policy.is_active ?? true,
        order_index: policy.order_index || 0
      };

      if (editingPolicy) {
        const { data, error } = await supabase
          .from('vendor_policies')
          .update({
            ...policyData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPolicy.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('vendor_policies')
          .insert({
            ...policyData,
            vendor_id: vendor.id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-policies'] });
      toast.success(editingPolicy ? 'Policy updated successfully' : 'Policy created successfully');
      resetForm();
    },
    onError: (error) => {
      console.error('Policy mutation error:', error);
      toast.error('Failed to save policy');
    }
  });

  // Delete policy mutation
  const deleteMutation = useMutation({
    mutationFn: async (policyId: string) => {
      const { error } = await supabase
        .from('vendor_policies')
        .delete()
        .eq('id', policyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-policies'] });
      toast.success('Policy deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete policy');
    }
  });

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      policy_type: 'general',
      is_active: true,
      order_index: 0
    });
    setEditingPolicy(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (policy: VendorPolicy) => {
    setEditingPolicy(policy);
    setFormData({
      title_en: policy.title_en,
      title_ar: policy.title_ar || '',
      description_en: policy.description_en,
      description_ar: policy.description_ar || '',
      policy_type: policy.policy_type,
      is_active: policy.is_active,
      order_index: policy.order_index
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_en || !formData.description_en) {
      toast.error('Please fill in required English fields');
      return;
    }
    policyMutation.mutate(formData);
  };

  const policyTypes = [
    { value: 'general', label: 'General' },
    { value: 'booking', label: 'Booking' },
    { value: 'cancellation', label: 'Cancellation' },
    { value: 'payment', label: 'Payment' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'damage', label: 'Damage' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading policies...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{language === 'ar' ? 'سياسات التأجير' : 'Rental Policies'}</h2>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة سياسات التأجير الخاصة بك' : 'Manage your rental policies'}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPolicy(null)}>
              <Plus className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'إضافة سياسة' : 'Add Policy'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy 
                  ? (language === 'ar' ? 'تعديل السياسة' : 'Edit Policy')
                  : (language === 'ar' ? 'إضافة سياسة جديدة' : 'Add New Policy')
                }
              </DialogTitle>
              <DialogDescription>
                {language === 'ar' 
                  ? 'أضف أو عدّل سياسات التأجير بكلا اللغتين العربية والإنجليزية'
                  : 'Add or edit rental policies in both Arabic and English'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'العنوان (إنجليزي) *' : 'Title (English) *'}
                  </label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Enter English title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                  </label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    placeholder="أدخل العنوان بالعربية"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'نوع السياسة' : 'Policy Type'}
                  </label>
                  <Select value={formData.policy_type} onValueChange={(value) => setFormData({ ...formData, policy_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {policyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'ترتيب العرض' : 'Display Order'}
                  </label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'الوصف (إنجليزي) *' : 'Description (English) *'}
                </label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Enter English description"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                </label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="أدخل الوصف بالعربية"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </label>
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button type="submit" disabled={policyMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {policyMutation.isPending 
                      ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                      : (language === 'ar' ? 'حفظ' : 'Save')
                    }
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Policies List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>{language === 'ar' ? 'السياسات الحالية' : 'Current Policies'}</span>
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'قائمة بجميع سياسات التأجير الخاصة بك'
              : 'List of all your rental policies'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {policies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>{language === 'ar' ? 'لم تقم بإضافة أي سياسات بعد' : 'No policies added yet'}</p>
              <p className="text-sm">
                {language === 'ar' 
                  ? 'ابدأ بإضافة سياسات التأجير الخاصة بك'
                  : 'Start by adding your rental policies'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ar' ? 'العنوان' : 'Title'}</TableHead>
                  <TableHead>{language === 'ar' ? 'النوع' : 'Type'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الترتيب' : 'Order'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {language === 'ar' && policy.title_ar ? policy.title_ar : policy.title_en}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {language === 'ar' && policy.description_ar ? policy.description_ar : policy.description_en}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {policy.policy_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={policy.is_active ? "default" : "secondary"}>
                        {policy.is_active 
                          ? (language === 'ar' ? 'نشط' : 'Active')
                          : (language === 'ar' ? 'غير نشط' : 'Inactive')
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>{policy.order_index}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(policy)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه السياسة؟' : 'Are you sure you want to delete this policy?')) {
                              deleteMutation.mutate(policy.id);
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPolicies;
