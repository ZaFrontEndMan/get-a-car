
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCountries, useCitiesByCountry } from '@/hooks/useCountriesAndCities';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

const AdminCities = () => {
  const { t, language } = useLanguage();
  const { data: countries } = useCountries();
  const queryClient = useQueryClient();
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    country_id: '',
    is_active: true
  });

  // Get cities for the selected country
  const { data: cities, isLoading, error } = useCitiesByCountry(selectedCountryId);

  const filteredCities = cities?.filter(city => 
    city.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.name_ar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_ar: '',
      country_id: selectedCountryId || '',
      is_active: true
    });
    setEditingCity(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCity) {
        const { error } = await supabase
          .from('cities')
          .update(formData)
          .eq('id', editingCity.id);
        
        if (error) throw error;
        toast.success(t('cityUpdated'));
      } else {
        const { error } = await supabase
          .from('cities')
          .insert([formData]);
        
        if (error) throw error;
        toast.success(t('cityCreated'));
      }
      
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving city:', error);
      toast.error(t('error'));
    }
  };

  const handleEdit = (city: any) => {
    setEditingCity(city);
    setFormData({
      name_en: city.name_en,
      name_ar: city.name_ar,
      country_id: city.country_id,
      is_active: city.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (cityId: string) => {
    if (!confirm(t('confirmDelete'))) return;
    
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', cityId);
      
      if (error) throw error;
      toast.success(t('cityDeleted'));
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error(t('error'));
    }
  };

  const toggleStatus = async (cityId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cities')
        .update({ is_active: !currentStatus })
        .eq('id', cityId);
      
      if (error) throw error;
      toast.success(t('statusUpdated'));
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">{t('citiesManagement')}</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t('addCity')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCity ? t('editCity') : t('addCity')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country_id">{t('country')}</Label>
                <Select
                  value={formData.country_id}
                  onValueChange={(value) => setFormData({...formData, country_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCountry')} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {language === 'ar' ? country.name_ar : country.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  {editingCity ? t('update') : t('create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country-select">{t('filterByCountry')}</Label>
              <Select value={selectedCountryId} onValueChange={setSelectedCountryId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCountry')} />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {language === 'ar' ? country.name_ar : country.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">{t('search')}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder={t('searchCities')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {!selectedCountryId ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('selectCountryToViewCities')}</p>
          </div>
        ) : isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{t('error')}</p>
            <Button onClick={() => window.location.reload()}>
              {t('retry')}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('country')}
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
                {filteredCities?.map((city) => {
                  const country = countries?.find(c => c.id === city.country_id);
                  return (
                    <tr key={city.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {language === 'ar' ? city.name_ar : city.name_en}
                          </div>
                          <div className="text-sm text-gray-500">
                            {language === 'ar' ? city.name_en : city.name_ar}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {country ? (language === 'ar' ? country.name_ar : country.name_en) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Switch
                          checked={city.is_active}
                          onCheckedChange={() => toggleStatus(city.id, city.is_active)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(city)}
                          className="inline-flex items-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>{t('edit')}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(city.id)}
                          className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{t('delete')}</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredCities?.length === 0 && selectedCountryId && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('noCitiesFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCities;
