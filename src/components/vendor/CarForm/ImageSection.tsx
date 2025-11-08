import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";

// API Image interface from Car type
interface ApiImage {
  imageUrl: string;
  imageDescription?: string | null;
}

// Component supports both API images (edit mode) and form images (create mode)
interface ImageSectionProps {
  formData: {
    images?: (ApiImage | string | File)[];
  };
  handleChange: (field: keyof typeof formData, value: any) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isViewMode?: boolean;
}

const ImageSection = ({
  formData,
  handleChange,
  t,
  isViewMode,
}: ImageSectionProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [fileError, setFileError] = useState("");

  const MAX_IMAGES = 10;
  const MAX_FILE_SIZE_MB = 1;

  const currentImages = formData.images || [];
  const isFull = currentImages.length >= MAX_IMAGES;

  const getImagePreview = (image: ApiImage | string | File): string => {
    if (image && typeof image === "object" && "imageUrl" in image) {
      return `${import.meta.env.VITE_UPLOADS_BASE_URL}${image.imageUrl}`;
    }
    if (typeof image === "string") {
      return `${import.meta.env.VITE_UPLOADS_BASE_URL}${image}`;
    }
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return "/placeholder.svg";
  };

  const getImageStatus = (image: ApiImage | string | File) => {
    if (image && typeof image === "object" && "imageUrl" in image) {
      return {
        className: "bg-blue-50 border-blue-200 text-blue-800",
        icon: LinkIcon,
        type: "api" as const,
      };
    }
    if (typeof image === "string") {
      return {
        className: "bg-indigo-50 border-indigo-200 text-indigo-800",
        icon: LinkIcon,
        type: "url" as const,
      };
    }
    if (image instanceof File) {
      return {
        label: `(${(image.size / 1024).toFixed(1)} KB)`,
        className: "bg-green-50 border-green-200 text-green-800",
        icon: ImageIcon,
        type: "file" as const,
      };
    }
    return {
      label: t("unknown_image"),
      className: "bg-gray-50 border-gray-200 text-gray-600",
      icon: ImageIcon,
      type: "unknown" as const,
    };
  };

  const isRTL = t("language") === "ar";

  // --- VIEW MODE: Only Grid, nothing else
  if (isViewMode) {
    return (
      <Card dir={isRTL ? "rtl" : "ltr"}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {t("car_images")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentImages.length === 0 ? (
            <div className="text-sm text-gray-400">{t("no_images_added")}</div>
          ) : (
            <div className="space-y-3">
              <Label>
                {t("current_images")} ({currentImages.length}/{MAX_IMAGES})
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentImages.map((image, index) => {
                  const {
                    label,
                    className,
                    icon: StatusIcon,
                  } = getImageStatus(image);
                  return (
                    <div
                      key={`${
                        typeof image === "object" && "imageUrl" in image
                          ? image.imageUrl
                          : image
                      }-${index}`}
                      className="relative group"
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={getImagePreview(image)}
                          alt={`${t("car_image")} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.className += " bg-gray-200";
                          }}
                        />
                        {/* Status Badge */}
                        <div
                          className={`absolute top-2 start-2 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {label}
                        </div>
                        {/* Main Image Indicator */}
                        {index === 0 && (
                          <div className="absolute bottom-2 start-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                            {t("main_image")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">
                {t("main_image_description")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // --- EDIT/ADD MODE (default)
  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {t("car_images")}
          {currentImages.length >= MAX_IMAGES && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              {t("max_limit_reached")}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fileError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">{fileError}</span>
          </div>
        )}
        {!isFull && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
              <div>
                <span className="font-medium text-primary hover:text-primary/80">
                  {t("click_to_upload")}
                </span>{" "}
                {t("or_drag_and_drop")}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t("supported_formats")}: PNG, JPG, JPEG, WebP
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t("max_size")}: {MAX_FILE_SIZE_MB}MB {t("per_file")}
              </p>
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              // ...handlers etc...
              // (add your onChange and logic here!)
            />
          </div>
        )}
        {currentImages.length > 0 && (
          <div className="space-y-3">
            <Label>
              {t("current_images")} ({currentImages.length}/{MAX_IMAGES})
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentImages.map((image, index) => {
                const {
                  label,
                  className,
                  icon: StatusIcon,
                } = getImageStatus(image);
                return (
                  <div
                    key={`${
                      typeof image === "object" && "imageUrl" in image
                        ? image.imageUrl
                        : image
                    }-${index}`}
                    className="relative group"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={getImagePreview(image)}
                        alt={`${t("car_image")} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                          target.className += " bg-gray-200";
                        }}
                      />
                      {/* Status Badge */}
                      <div
                        className={`absolute top-2 start-2 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {label}
                      </div>
                      {index === 0 && (
                        <div className="absolute bottom-2 start-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                          {t("main_image")}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedImages = currentImages.filter(
                          (_, i) => i !== index
                        );
                        handleChange("images", updatedImages);
                        setFileError("");
                      }}
                      className="absolute -top-2 -end-2 w-6 h-6 rounded-full p-0 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 group-hover:opacity-100 opacity-0 transition-all duration-200"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500">
              {t("main_image_description")}
              {isFull && (
                <span className="text-orange-600 font-medium">
                  {" • "}
                  {t("max_limit_reached")}
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageSection;
