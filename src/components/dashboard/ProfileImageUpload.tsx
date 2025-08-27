
import React, { useState } from 'react';
import { Upload, X, Camera, FileText, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
  type: 'avatar' | 'national_id' | 'driving_license';
  title: string;
  description: string;
  className?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  onImageUpdate,
  type,
  title,
  description,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const { user } = useAuth();

  const getIcon = () => {
    switch (type) {
      case 'avatar':
        return <Camera className="h-8 w-8 text-gray-400" />;
      case 'national_id':
        return <FileText className="h-8 w-8 text-gray-400" />;
      case 'driving_license':
        return <CreditCard className="h-8 w-8 text-gray-400" />;
      default:
        return <Upload className="h-8 w-8 text-gray-400" />;
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      // Create file name with user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      setPreviewUrl(publicUrl);
      onImageUpdate(publicUrl);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      handleFileUpload(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageUpdate('');
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {previewUrl && (
          <button
            onClick={removeImage}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="relative">
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt={title}
              className={`w-full rounded-lg object-cover ${
                type === 'avatar' ? 'h-48' : 'h-32'
              }`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Upload className="h-4 w-4 mr-2 inline" />
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className={`border-2 border-dashed border-gray-300 rounded-lg ${
            type === 'avatar' ? 'h-48' : 'h-32'
          } flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors`}>
            {getIcon()}
            <span className="mt-2 text-sm text-gray-600">
              {isUploading ? 'Uploading...' : 'Click to upload'}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              PNG, JPG up to 5MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;
