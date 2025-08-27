
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCountries } from '@/hooks/useCountriesAndCities';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Globe, Search } from 'lucide-react';
import { toast } from 'sonner';

const AdminCountries = () => {
  const { t, language } = useLanguage();
  const { data: countries, isLoading, error } = useCountries();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<any>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    code: '',
    is_active: true
  });

  const filteredCountries = countries?.filter(country => 
    country.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_ar: '',
      code: '',
      is_active: true
    });
    setEditingCountry(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCountry) {
        const { error } = await supabase
          .from('countries')
          .update(formData)
          .eq('id', editingCountry.id);
        
        if (error) throw error;
        toast.success(t('countryUpdated'));
      } else {
        const { error } = await supabase
          .from('countries')
          .insert([formData]);
        
        if (error) throw error;
        toast.success(t('countryCreated'));
      }
      
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving country:', error);
      toast.error(t('error'));
    }
  };

  const handleEdit = (country: any) => {
    setEditingCountry(country);
    setFormData({
      name_en: country.name_en,
      name_ar: country.name_ar,
      code: country.code,
      is_active: country.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (countryId: string) => {
    if (!confirm(t('confirmDelete'))) return;
    
    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', countryId);
      
      if (error) throw error;
      toast.success(t('countryDeleted'));
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    } catch (error) {
      console.error('Error deleting country:', error);
      toast.error(t('error'));
    }
  };

  const toggleStatus = async (countryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('countries')
        .update({ is_active: !currentStatus })
        .eq('id', countryId);
      
      if (error) throw error;
      toast.success(t('statusUpdated'));
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('error'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{t('error')}</p>
        <Button onClick={() => window.location.reload()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">{t('countriesManagement')}</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t('addCountry')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCountry ? t('editCountry') : t('addCountry')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name_en">{t('nameEnglish')}</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_ar">{t('nameArabic')}</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">{t('countryCode')}</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  maxLength={2}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">{t('active')}</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {editingCountry ? t('update') : t('create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('searchCountries')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('code')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCountries?.map((country) => (
                <tr key={country.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">
                        {language === 'ar' ? country.name_ar : country.name_en}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'ar' ? country.name_en : country.name_ar}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                      {country.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      checked={country.is_active}
                      onCheckedChange={() => toggleStatus(country.id, country.is_active)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(country)}
                      className="inline-flex items-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>{t('edit')}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(country.id)}
                      className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{t('delete')}</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCountries?.length === 0 && (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('noCountriesFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCountries;
