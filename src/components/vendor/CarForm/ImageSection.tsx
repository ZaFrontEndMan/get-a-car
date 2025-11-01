import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface ImageSectionProps {
  formData: {
    images: (string | File)[];
  };
  handleChange: (field: string, value: any) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const ImageSection = ({ formData, handleChange, t }: ImageSectionProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");

  const addImageUrl = () => {
    if (
      newImageUrl.trim() &&
      !formData.images.some(
        (img) => typeof img === "string" && img === newImageUrl.trim()
      )
    ) {
      const updatedImages = [...formData.images, newImageUrl.trim()];
      handleChange("images", updatedImages);
      setNewImageUrl("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const updatedImages = [...formData.images, ...fileArray];
    handleChange("images", updatedImages);

    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    handleChange("images", updatedImages);
  };

  const getImagePreview = (image: string | File): string => {
    if (typeof image === "string") {
      return `${import.meta.env.VITE_UPLOADS_BASE_URL}${image}`;
    }
    return URL.createObjectURL(image);
  };

  const getImageName = (image: string | File): string => {
    if (typeof image === "string") {
      return image.length > 80 ? image.substring(0, 80) + "..." : image;
    }
    return image.name;
  };

  const isRTL = t("language") === "ar";

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">{t("car_images")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              {t("upload_files")}
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="h-4 w-4 mr-2" />
              {t("add_url")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <div>
                  <span className="font-medium text-primary hover:text-primary/80">
                    {t("click_to_upload")}
                  </span>{" "}
                  {t("or_drag_and_drop")}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t("supported_formats")}: PNG, JPG, JPEG, WebP
                </p>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="image-url">{t("image_url")}</Label>
                <Input
                  id="image-url"
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder={t("enter_image_url")}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={addImageUrl}
                className="mt-6"
                disabled={!newImageUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t("add")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {formData.images.length > 0 ? (
          <div className="space-y-2">
            <Label>
              {t("current_images")} ({formData.images.length})
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <img
                      src={getImagePreview(image)}
                      alt={`${t("car_image")} ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    {typeof image !== "string" ? (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                        <ImageIcon className="h-3 w-3" />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">
                      {getImageName(image)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {typeof image === "string"
                        ? t("url_image")
                        : `${t("file")}: ${(image.size / 1024).toFixed(2)} KB`}
                    </p>
                    {index === 0 ? (
                      <span className="text-xs text-primary font-medium">
                        {t("main_image")}
                      </span>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {t("main_image_description")}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>{t("no_images_added")}</p>
            <p className="text-sm">{t("upload_files_or_add_urls")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageSection;
