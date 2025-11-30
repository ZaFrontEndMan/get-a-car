import React, { useState } from "react";
import { Image, CreditCard, MapPin, Globe2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVendorAuth } from "@/hooks/vendor/useVendorAuth";
import LazyImage from "../ui/LazyImage";
import ProfileImageUpload from "@/components/dashboard/ProfileImageUpload";

type VendorDocumentField =
  | "companyLogo"
  | "businessLicense"
  | "taxType"
  | "insurance";

const VendorProfile = () => {
  const { t, language } = useLanguage();
  const {
    data,
    loading,
    error,
    editForm,
    setEditForm,
    logoFile,
    setLogoFile,
    fetchUserInfo,
    handleEdit,
  } = useVendorAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [uploadingField, setUploadingField] =
    useState<VendorDocumentField | null>(null);

  const [documentFiles, setDocumentFiles] = useState<{
    businessLicense: File | null;
    taxType: File | null;
    insurance: File | null;
  }>({
    businessLicense: null,
    taxType: null,
    insurance: null,
  });

  const handleImageClick = (imageUrl: string | null, documentType: string) => {
    if (!imageUrl) return;
    setSelectedImage(imageUrl);
    setSelectedDocumentType(documentType);
    setIsDocumentModalOpen(true);
  };

  const handleCloseDocumentModal = () => {
    setIsDocumentModalOpen(false);
    setSelectedImage(null);
    setSelectedDocumentType("");
  };

  const handleEditClick = () => {
    setDocumentFiles({
      businessLicense: null,
      taxType: null,
      insurance: null,
    });
    setLogoFile(null);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setUploadingField(null);

      const filesToUpload = {
        companyLogo: logoFile,
        businessLicense: documentFiles.businessLicense,
        taxType: documentFiles.taxType,
        insurance: documentFiles.insurance,
      };

      await handleEdit(filesToUpload);

      await fetchUserInfo();

      setIsEditModalOpen(false);

      setDocumentFiles({
        businessLicense: null,
        taxType: null,
        insurance: null,
      });
      setLogoFile(null);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    if (data) {
      setEditForm({
        nickName: data.nickName || "",
        fullName: data.fullName || "",
        address: data.location || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
      });
    }
    setLogoFile(null);
    setDocumentFiles({
      businessLicense: null,
      taxType: null,
      insurance: null,
    });
  };

  const handleImageUpdate = (fieldName: VendorDocumentField, file: File) => {
    setUploadingField(fieldName);

    if (fieldName === "companyLogo") {
      setLogoFile(file);
    } else {
      setDocumentFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-gray-200 animate-pulse rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          {t("vendorProfile")}
        </h2>
        <Button onClick={handleEditClick}>{t("editProfile")}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("profileInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Logo Display */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("companyLogo")}
                  </label>
                  <div className="mt-2 relative">
                    {data?.companyLogo ? (
                      <LazyImage
                        src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                          data.companyLogo
                        }`}
                        alt={data.fullName}
                        className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() =>
                          handleImageClick(
                            `${import.meta.env.VITE_UPLOADS_BASE_URL}${
                              data.companyLogo
                            }`,
                            "companyLogo"
                          )
                        }
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
                    <label className="text-sm font-medium text-gray-600">
                      {t("companyName")}
                    </label>
                    <p className="text-gray-900">
                      {data?.fullName || t("notSet")}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("nickName")}
                    </label>
                    <p className="text-gray-900">
                      {data?.nickName || t("notSet")}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("managerName")}
                    </label>
                    <p className="text-gray-900">
                      {data?.managerName || t("notSet")}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("email")}
                    </label>
                    <p className="text-gray-900">
                      {data?.email || t("notSet")}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("phone")}
                    </label>
                    <p className="text-gray-900">
                      {data?.phoneNumber || t("notSet")}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("location")}
                    </label>
                    <p className="text-gray-900">
                      {data?.location || t("notSet")}
                    </p>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span>{t("personalInformation")}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("nationalId")}
                      </label>
                      <p className="text-gray-900">
                        {data?.nationalId || t("notSet")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{t("locationInformation")}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("country")}
                      </label>
                      <p className="text-gray-900">
                        {data?.countryName || t("notSet")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("city")}
                      </label>
                      <p className="text-gray-900">
                        {data?.cityName || t("notSet")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Information */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Globe2 className="h-5 w-5" />
                    <span>{t("documentInformation")}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Business License */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("businessLicense")}
                      </label>
                      <div className="mt-2">
                        {data?.businessLicense ? (
                          <LazyImage
                            src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                              data.businessLicense
                            }`}
                            alt={t("businessLicense")}
                            className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() =>
                              handleImageClick(
                                `${import.meta.env.VITE_UPLOADS_BASE_URL}${
                                  data.businessLicense
                                }`,
                                "businessLicense"
                              )
                            }
                          />
                        ) : (
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <Image className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tax Type */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("taxType")}
                      </label>
                      <div className="mt-2">
                        {data?.taxType ? (
                          <LazyImage
                            src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                              data.taxType
                            }`}
                            alt={t("taxType")}
                            className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() =>
                              handleImageClick(
                                `${import.meta.env.VITE_UPLOADS_BASE_URL}${
                                  data.taxType
                                }`,
                                "taxType"
                              )
                            }
                          />
                        ) : (
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <Image className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Insurance */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("insurance")}
                      </label>
                      <div className="mt-2">
                        {data?.insurance ? (
                          <LazyImage
                            src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                              data.insurance
                            }`}
                            alt={t("insurance")}
                            className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() =>
                              handleImageClick(
                                `${import.meta.env.VITE_UPLOADS_BASE_URL}${
                                  data.insurance
                                }`,
                                "insurance"
                              )
                            }
                          />
                        ) : (
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <Image className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Status Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("accountStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("verified")}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    data?.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {data?.isVerified ? t("verified") : t("pending")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("canMakeOffer")}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    data?.canMakeOffer
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {data?.canMakeOffer ? t("yes") : t("no")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("blackList")}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    data?.blackList
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {data?.blackList ? t("yes") : t("no")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document / Logo Viewer Modal */}
      <Dialog
        open={isDocumentModalOpen}
        onOpenChange={handleCloseDocumentModal}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("documentInformation")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedImage ? (
              <LazyImage
                src={selectedImage}
                alt={t(selectedDocumentType)}
                className="max-w-[400px] max-h-[400px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-[400px] h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Image className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">{t("close")}</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-start">{t("editProfile")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("basicInformation")}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">{t("companyName")}</Label>
                  <Input
                    id="fullName"
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nickName">{t("nickName")}</Label>
                  <Input
                    id="nickName"
                    value={editForm.nickName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        nickName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t("location")}</Label>
                  <Input
                    id="address"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">{t("phone")}</Label>
                  <Input
                    id="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Documents Upload - Using ProfileImageUpload Component */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">
                {t("documentInformation")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo */}
                <ProfileImageUpload
                  currentImageUrl={data?.companyLogo}
                  fieldName="companyLogo"
                  as
                  any
                  onImageUpdate={handleImageUpdate as any}
                  type="avatar"
                  title={t("companyLogo")}
                  description={t("uploadCompanyLogo")}
                  loading={uploadingField === "companyLogo"}
                />

                {/* Business License */}
                <ProfileImageUpload
                  currentImageUrl={data?.businessLicense}
                  fieldName="businessLicense"
                  as
                  any
                  onImageUpdate={handleImageUpdate as any}
                  type="national_id"
                  title={t("businessLicense")}
                  description={t("uploadBusinessLicense")}
                  loading={uploadingField === "businessLicense"}
                />

                {/* Tax Type */}
                <ProfileImageUpload
                  currentImageUrl={data?.taxType}
                  fieldName="taxType"
                  as
                  any
                  onImageUpdate={handleImageUpdate as any}
                  type="national_id"
                  title={t("taxType")}
                  description={t("uploadTaxType")}
                  loading={uploadingField === "taxType"}
                />

                {/* Insurance */}
                <ProfileImageUpload
                  currentImageUrl={data?.insurance}
                  fieldName="insurance"
                  as
                  any
                  onImageUpdate={handleImageUpdate as any}
                  type="driving_license"
                  title={t("insurance")}
                  description={t("uploadInsurance")}
                  loading={uploadingField === "insurance"}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={handleCancelEdit}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveEdit}>{t("saveChanges")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProfile;
