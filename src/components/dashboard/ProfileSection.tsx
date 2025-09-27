import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../../contexts/LanguageContext";
import { profileSchema, ProfileFormData } from "../../schemas/profileSchema";
import { useGetUserInfo, useEditClient } from "@/hooks/client/useClientProfile";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Save,
  Edit3,
  Mail,
  Hash,
  Globe,
} from "lucide-react";
import ProfileImageUpload from "./ProfileImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const ProfileSection: React.FC = () => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<ProfileFormData | null>(
    null
  );

  const { data, isLoading } = useGetUserInfo();
  const editMutation = useEditClient();
  const profile = data?.data;
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {} as ProfileFormData,
  });
  console.log(profile);

  // Reset form when profile data is fetched
  useEffect(() => {
    if (profile) {
      const formData = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        fullName: profile.fullName || "",
        birthDate: profile.birthDate?.split("T")[0] || "",
        gender: profile.gender || 1,
        countryName: profile.countryName || "",
        cityName: profile.cityName || "",
        licenseNumber: profile.licenseNumber || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        nationalId: profile.nationalId || "",
        profilePictureIsDeleted: false,
      };
      form.reset(formData);
      setOriginalData(formData);
    }
  }, [profile, form]);

  // Function to get only changed fields
  const getChangedFields = (
    currentData: ProfileFormData
  ): Partial<ProfileFormData> => {
    if (!originalData) return currentData;

    const changedFields: Partial<ProfileFormData> = {};

    (Object.keys(currentData) as Array<keyof ProfileFormData>).forEach(
      (key) => {
        if (currentData[key] !== originalData[key]) {
          (changedFields as any)[key] = currentData[key];
        }
      }
    );

    return changedFields;
  };

  // Handle image update for all document fields
  const handleImageUpdate = (fieldName: string, file: File) => {
    const updateData = { [fieldName]: file };
    editMutation.mutate(updateData as ProfileFormData, {
      onSuccess: (data) => {
        toast.success(data?.customMessage);
        setOriginalData((prev) => ({
          ...prev,
          ...data,
        }));
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.error?.message ||
            "An error occurred while updating the image."
        );
      },
    });
  };

  // Handle submit
  const onSubmit = (data: ProfileFormData) => {
    const changedFields = getChangedFields(data);

    // Only submit if there are actual changes
    if (Object.keys(changedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    editMutation.mutate(changedFields as ProfileFormData, {
      onSuccess: () => {
        setIsEditing(false);
        // Update original data with the new values
        setOriginalData(data);
      },
    });
  };

  if (isLoading) {
    return <div className="p-6 animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("profileSettings")}
          </h1>
          <p className="text-gray-600 mt-1">{t("profileDescription")}</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  form.reset(profile);
                  setIsEditing(false);
                }}
                disabled={editMutation.isPending}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={editMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {editMutation.isPending ? t("saving") : t("saveChanges")}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              {t("editProfile")}
            </Button>
          )}
        </div>
      </div>

      {/* Row layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Profile Form (9/12) */}
        <div className="col-span-12 md:col-span-9">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("personalInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t("firstName")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              placeholder="Enter your first name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t("lastName")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              placeholder="Enter your last name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t("fullNameLabel")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Enter your full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {t("emailLabel")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={!isEditing}
                            placeholder="Enter your email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t("phone")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            disabled={!isEditing}
                            placeholder="Enter your phone number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {t("dateOfBirth")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="date" disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t("gender")}
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString()}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectGender")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">{t("male")}</SelectItem>
                            <SelectItem value="2">{t("female")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="countryName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {t("country")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              placeholder="Enter your country"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {t("city")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              placeholder="Enter your city"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {t("drivingLicense")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Enter your license number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          {t("nationalIdLabel")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Enter your national ID"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Image Uploads (3/12) */}
        <div className="col-span-12 md:col-span-3 space-y-6">
          <ProfileImageUpload
            loading={editMutation.isPending}
            currentImageUrl={profile?.profilePicture || ""}
            fieldName="profilePicture"
            onImageUpdate={handleImageUpdate}
            type="avatar"
            title={t("profilePicture")}
            description={t("uploadProfilePhoto")}
          />
          <ProfileImageUpload
            loading={editMutation.isPending}
            currentImageUrl={profile?.nationalIdFront || ""}
            fieldName="nationalIdFront"
            onImageUpdate={handleImageUpdate}
            type="national_id"
            title={t("nationalIdFront")}
            description={t("uploadNationalIdFront")}
          />
          <ProfileImageUpload
            loading={editMutation.isPending}
            currentImageUrl={profile?.nationalIdBack || ""}
            fieldName="nationalIdBack"
            onImageUpdate={handleImageUpdate}
            type="national_id"
            title={t("nationalIdBack")}
            description={t("uploadNationalIdBack")}
          />
          <ProfileImageUpload
            loading={editMutation.isPending}
            currentImageUrl={profile?.drivingLicenseFront || ""}
            fieldName="drivingLicenseFront"
            onImageUpdate={handleImageUpdate}
            type="driving_license"
            title={t("drivingLicenseFront")}
            description={t("uploadDrivingLicenseFront")}
          />
          <ProfileImageUpload
            loading={editMutation.isPending}
            currentImageUrl={profile?.drivingLicenseBack || ""}
            fieldName="drivingLicenseBack"
            onImageUpdate={handleImageUpdate}
            type="driving_license"
            title={t("drivingLicenseBack")}
            description={t("uploadDrivingLicenseBack")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
