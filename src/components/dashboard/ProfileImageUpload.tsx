import React, { useState, useEffect } from "react";
import { Upload, Camera, FileText, CreditCard } from "lucide-react";

type DocumentFieldName =
  | "profilePicture"
  | "nationalIdFront"
  | "nationalIdBack"
  | "drivingLicenseFront"
  | "drivingLicenseBack";

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  fieldName: DocumentFieldName;
  onImageUpdate: (fieldName: DocumentFieldName, file: File) => void;
  type: "avatar" | "national_id" | "driving_license";
  title: string;
  description: string;
  className?: string;
  loading: boolean;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  fieldName,
  onImageUpdate,
  type,
  title,
  description,
  className = "",
  loading,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  // Trigger pulse animation when loading starts for this field
  useEffect(() => {
    if (loading) {
      setPulseKey(prev => prev + 1);
    }
  }, [loading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);

      // Immediately call onImageUpdate with the file
      onImageUpdate(fieldName, file);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "avatar":
        return <Camera className="h-8 w-8 text-gray-400" />;
      case "national_id":
        return <FileText className="h-8 w-8 text-gray-400" />;
      case "driving_license":
        return <CreditCard className="h-8 w-8 text-gray-400" />;
      default:
        return <Upload className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <div
      key={pulseKey}
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className} ${loading ? "animate-pulse" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <div className="relative">
        {currentImageUrl || previewUrl ? (
          <div className="relative group">
            <img
              src={
                previewUrl ||
                `${import.meta.env.VITE_UPLOADS_BASE_URL}${currentImageUrl}`
              }
              alt={title}
              className={`w-full rounded-lg object-cover ${
                type === "avatar" ? "h-48" : "h-32"
              } ${loading ? "animate-pulse" : ""}`}
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
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        ) : (
          <label
            className={`border-2 border-dashed border-gray-300 rounded-lg ${
              type === "avatar" ? "h-48" : "h-32"
            } flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {getIcon()}
            <span className="mt-2 text-sm text-gray-600">
              {loading ? "Uploading..." : "Click to upload"}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              PNG, JPG up to 5MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;
