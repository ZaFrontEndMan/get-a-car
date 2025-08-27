
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Upload } from 'lucide-react';

interface ImageSectionProps {
  formData: {
    images: string[];
  };
  handleChange: (field: string, value: any) => void;
}

const ImageSection = ({ formData, handleChange }: ImageSectionProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const addImageUrl = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      const updatedImages = [...formData.images, newImageUrl.trim()];
      handleChange('images', updatedImages);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    handleChange('images', updatedImages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Car Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/car-image.jpg"
            />
          </div>
          <Button
            type="button"
            onClick={addImageUrl}
            className="mt-6"
            disabled={!newImageUrl.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {formData.images.length > 0 && (
          <div className="space-y-2">
            <Label>Current Images ({formData.images.length})</Label>
            <div className="grid grid-cols-1 gap-3">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={imageUrl}
                    alt={`Car image ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 truncate">{imageUrl}</p>
                    {index === 0 && (
                      <span className="text-xs text-primary font-medium">Main Image</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              The first image will be used as the main image for the car listing.
            </p>
          </div>
        )}

        {formData.images.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No images added yet</p>
            <p className="text-sm">Add image URLs to showcase your car</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageSection;
