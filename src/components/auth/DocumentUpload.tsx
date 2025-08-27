
import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentUploadProps {
  onImageUpdate: (url: string) => void;
  currentImageUrl?: string;
  documentType: string;
  title: string;
  side?: 'front' | 'back';
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onImageUpdate,
  currentImageUrl,
  documentType,
  title,
  side
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const { t } = useLanguage();

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}_${side || 'document'}_${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      setPreviewUrl(publicUrl);
      onImageUpdate(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </label>
      <div className="relative">
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt={title}
              className="w-full h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <label className="cursor-pointer bg-white text-gray-900 px-3 py-1 rounded-md text-sm">
                {t('change')}
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
          <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
            <FileText className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-600">
              {isUploading ? t('uploading') : t('clickToUpload')}
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

export default DocumentUpload;
