
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProfile } from '../../hooks/useProfile';
import { User, Phone, Calendar, MapPin, CreditCard, FileText, Save, Edit3 } from 'lucide-react';
import ProfileImageUpload from './ProfileImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfileSection: React.FC = () => {
  const { t } = useLanguage();
  const { profile, updateProfile, isLoading, isUpdating } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    date_of_birth: '',
    driver_license_number: '',
    avatar_url: '',
    national_id_image_url: '',
    driving_license_image_url: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        date_of_birth: profile.date_of_birth || '',
        driver_license_number: profile.driver_license_number || '',
        avatar_url: profile.avatar_url || '',
        national_id_image_url: profile.national_id_image_url || '',
        driving_license_image_url: profile.driving_license_image_url || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpdate = (field: string, url: string) => {
    setFormData(prev => ({ ...prev, [field]: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the form data with proper null handling for empty fields
    const updateData = {
      ...formData,
      // Convert empty strings to null for optional fields
      phone: formData.phone.trim() === '' ? null : formData.phone,
      address: formData.address.trim() === '' ? null : formData.address,
      city: formData.city.trim() === '' ? null : formData.city,
      date_of_birth: formData.date_of_birth.trim() === '' ? null : formData.date_of_birth,
      driver_license_number: formData.driver_license_number.trim() === '' ? null : formData.driver_license_number,
      avatar_url: formData.avatar_url.trim() === '' ? null : formData.avatar_url,
      national_id_image_url: formData.national_id_image_url.trim() === '' ? null : formData.national_id_image_url,
      driving_license_image_url: formData.driving_license_image_url.trim() === '' ? null : formData.driving_license_image_url
    };

    console.log('Submitting profile update:', updateData);
    updateProfile(updateData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        date_of_birth: profile.date_of_birth || '',
        driver_license_number: profile.driver_license_number || '',
        avatar_url: profile.avatar_url || '',
        national_id_image_url: profile.national_id_image_url || '',
        driving_license_image_url: profile.driving_license_image_url || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('profileSettings')}</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and documents</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isUpdating}>
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('firstName')}
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('lastName')}
                    </Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t('phone')}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="date_of_birth" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('dateOfBirth')}
                  </Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('address')}
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('city')}
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="driver_license_number" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t('drivingLicense')}
                  </Label>
                  <Input
                    id="driver_license_number"
                    value={formData.driver_license_number}
                    onChange={(e) => handleInputChange('driver_license_number', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="License number"
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Image Uploads */}
        <div className="space-y-6">
          <ProfileImageUpload
            currentImageUrl={formData.avatar_url}
            onImageUpdate={(url) => handleImageUpdate('avatar_url', url)}
            type="avatar"
            title="Profile Picture"
            description="Upload your profile photo"
          />

          <ProfileImageUpload
            currentImageUrl={formData.national_id_image_url}
            onImageUpdate={(url) => handleImageUpdate('national_id_image_url', url)}
            type="national_id"
            title="National ID"
            description="Upload your national ID document"
          />

          <ProfileImageUpload
            currentImageUrl={formData.driving_license_image_url}
            onImageUpdate={(url) => handleImageUpdate('driving_license_image_url', url)}
            type="driving_license"
            title="Driving License"
            description="Upload your driving license"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
