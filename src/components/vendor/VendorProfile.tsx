import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Save, X, Upload, Image, Calendar, CreditCard, FileText, MapPin, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ProfileImageUpload from '@/components/dashboard/ProfileImageUpload';
import { useCountries, useCitiesByCountry, getSaudiArabiaId } from '@/hooks/useCountriesAndCities';
import { useLanguage } from '@/contexts/LanguageContext';

const VendorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    location: '',
    website: '',
    logo_url: '',
    national_id: '',
    national_id_front_image_url: '',
    national_id_back_image_url: '',
    license_id: '',
    license_id_front_image_url: '',
    license_id_back_image_url: '',
    country: 'Saudi Arabia',
    city: '',
    date_of_birth: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const { data: countries } = useCountries();
  const { data: cities } = useCitiesByCountry(selectedCountryId);

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor-profile'],
    queryFn: async () => {
      console.log('Fetching vendor profile...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id, user?.email);
      
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      console.log('Vendor query result:', { data, error });
      console.log('Vendor verified status:', data?.verified);
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (vendor) {
      console.log('Setting form data from vendor:', vendor);
      setFormData({
        name: vendor.name || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        description: vendor.description || '',
        location: vendor.location || '',
        website: vendor.website || '',
        logo_url: vendor.logo_url || '',
        national_id: vendor.national_id || '',
        national_id_front_image_url: vendor.national_id_front_image_url || '',
        national_id_back_image_url: vendor.national_id_back_image_url || '',
        license_id: vendor.license_id || '',
        license_id_front_image_url: vendor.license_id_front_image_url || '',
        license_id_back_image_url: vendor.license_id_back_image_url || '',
        country: vendor.country || 'Saudi Arabia',
        city: vendor.city || '',
        date_of_birth: vendor.date_of_birth || ''
      });
      setLogoPreview(vendor.logo_url || '');

      // Set selected country for cities dropdown
      if (vendor.country && countries) {
        const country = countries.find(c => c.name_en === vendor.country);
        if (country) {
          setSelectedCountryId(country.id);
        }
      }
    }
  }, [vendor, countries]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${vendor?.id}-${Date.now()}.${fileExt}`;
    
    setIsUploading(true);
    try {
      const { data, error } = await supabase.storage
        .from('vendor-logos')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vendor-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedFormData = { ...formData };

    // Upload logo if a new file was selected
    if (logoFile) {
      try {
        const logoUrl = await uploadLogo(logoFile);
        updatedFormData.logo_url = logoUrl;
        setFormData(updatedFormData);
      } catch (error) {
        console.error('Logo upload error:', error);
        toast({
          title: "Error",
          description: "Failed to upload logo",
          variant: "destructive"
        });
        return;
      }
    }

    updateMutation.mutate(updatedFormData);
  };

  const handleCancel = () => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        description: vendor.description || '',
        location: vendor.location || '',
        website: vendor.website || '',
        logo_url: vendor.logo_url || '',
        national_id: vendor.national_id || '',
        national_id_front_image_url: vendor.national_id_front_image_url || '',
        national_id_back_image_url: vendor.national_id_back_image_url || '',
        license_id: vendor.license_id || '',
        license_id_front_image_url: vendor.license_id_front_image_url || '',
        license_id_back_image_url: vendor.license_id_back_image_url || '',
        country: vendor.country || 'Saudi Arabia',
        city: vendor.city || '',
        date_of_birth: vendor.date_of_birth || ''
      });
      setLogoPreview(vendor.logo_url || '');
    }
    setLogoFile(null);
    setIsEditing(false);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Updating vendor with data:', data);
      const { error } = await supabase
        .from('vendors')
        .update(data)
        .eq('id', vendor.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });
      setIsEditing(false);
      setLogoFile(null);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  });

  // Create unique cities list to avoid duplicate keys
  const uniqueCities = React.useMemo(() => {
    if (!cities) return [];
    
    const seen = new Set();
    return cities.filter(city => {
      const key = `${city.name_en}-${city.name_ar}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [cities]);

  if (isLoading) {
    return <div className="animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Vendor Profile</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Logo Upload Section */}
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="mb-2"
                        />
                        <p className="text-sm text-gray-500">
                          Upload a logo that will be displayed on the website. Recommended size: 200x200px
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Company Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Personal Information</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="national_id">National ID Number</Label>
                        <Input
                          id="national_id"
                          value={formData.national_id}
                          onChange={(e) => handleChange('national_id', e.target.value)}
                          placeholder="Enter your national ID number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="license_id">Driving License Number</Label>
                        <Input
                          id="license_id"
                          value={formData.license_id}
                          onChange={(e) => handleChange('license_id', e.target.value)}
                          placeholder="Enter your license number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => handleChange('date_of_birth', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Location Information</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select 
                          value={formData.country} 
                          onValueChange={(value) => {
                            handleChange('country', value);
                            const country = countries?.find(c => c.name_en === value);
                            setSelectedCountryId(country?.id || '');
                            handleChange('city', ''); // Reset city when country changes
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries?.map((country) => (
                              <SelectItem key={country.id} value={country.name_en}>
                                {language === 'ar' ? country.name_ar : country.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="city">City</Label>
                        <Select 
                          value={formData.city} 
                          onValueChange={(value) => handleChange('city', value)}
                          disabled={!selectedCountryId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueCities?.map((city, index) => (
                              <SelectItem key={`${city.id}-${index}`} value={city.name_en}>
                                {language === 'ar' ? city.name_ar : city.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Document Images */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Identity Documents</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <ProfileImageUpload
                          currentImageUrl={formData.national_id_front_image_url}
                          onImageUpdate={(url) => handleChange('national_id_front_image_url', url)}
                          type="national_id"
                          title="National ID - Front"
                          description="Upload front side of your National ID"
                        />
                      </div>

                      <div>
                        <ProfileImageUpload
                          currentImageUrl={formData.national_id_back_image_url}
                          onImageUpdate={(url) => handleChange('national_id_back_image_url', url)}
                          type="national_id"
                          title="National ID - Back"
                          description="Upload back side of your National ID"
                        />
                      </div>

                      <div>
                        <ProfileImageUpload
                          currentImageUrl={formData.license_id_front_image_url}
                          onImageUpdate={(url) => handleChange('license_id_front_image_url', url)}
                          type="driving_license"
                          title="Driving License - Front"
                          description="Upload front side of your Driving License"
                        />
                      </div>

                      <div>
                        <ProfileImageUpload
                          currentImageUrl={formData.license_id_back_image_url}
                          onImageUpdate={(url) => handleChange('license_id_back_image_url', url)}
                          type="driving_license"
                          title="Driving License - Back"
                          description="Upload back side of your Driving License"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      placeholder="Tell customers about your car rental business..."
                    />
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={updateMutation.isPending || isUploading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Logo Display */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Company Logo</Label>
                    <div className="mt-2">
                      {vendor?.logo_url ? (
                        <img
                          src={vendor.logo_url}
                          alt={vendor.name}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Company Name</Label>
                      <p className="text-gray-900">{vendor?.name || 'Not set'}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-gray-900">{vendor?.email || 'Not set'}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Phone</Label>
                      <p className="text-gray-900">{vendor?.phone || 'Not set'}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Location</Label>
                      <p className="text-gray-900">{vendor?.location || 'Not set'}</p>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-600">Website</Label>
                      <p className="text-gray-900">
                        {vendor?.website ? (
                          <a
                            href={vendor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {vendor.website}
                          </a>
                        ) : (
                          'Not set'
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-gray-900 mt-1">{vendor?.description || 'No description provided'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats & Status Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verified</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  vendor?.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {vendor?.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <div>Vendor ID: {vendor?.id}</div>
                <div>User ID: {vendor?.user_id}</div>
                <div>Verified: {vendor?.verified ? 'true' : 'false'}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rating</span>
                <span className="text-sm text-gray-900">
                  {vendor?.rating || 0}/5.0 ({vendor?.total_reviews || 0} reviews)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-gray-900">
                  {vendor?.created_at ? new Date(vendor.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            {/* Additional status card content can go here */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
