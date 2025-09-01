import { z } from "zod";

// Profile form validation schema - Updated to match real API structure
export const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be less than 100 characters"),
  birthDate: z.string().min(1, "Birth date is required"),
  gender: z.number().min(1, "Gender is required").max(2, "Invalid gender selection"),
  countryName: z.string().min(1, "Country is required"),
  cityName: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters").max(200, "Address must be less than 200 characters"),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters").max(20, "License number must be less than 20 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number must be less than 15 characters"),
  nationalId: z.string().min(10, "National ID must be at least 10 characters").max(20, "National ID must be less than 20 characters"),
  profilePictureIsDeleted: z.boolean().default(false),
  // File uploads are optional
  profilePicture: z.instanceof(File).optional(),
  nationalIdFront: z.instanceof(File).optional(),
  nationalIdBack: z.instanceof(File).optional(),
  drivingLicenseFront: z.instanceof(File).optional(),
  drivingLicenseBack: z.instanceof(File).optional(),
});

// Type inference from schema
export type ProfileFormData = z.infer<typeof profileSchema>;

// Default values for the form - Updated to match real API structure
export const defaultProfileValues: ProfileFormData = {
  firstName: "",
  lastName: "",
  fullName: "",
  birthDate: "",
  gender: 1,
  countryName: "",
  cityName: "",
  address: "",
  licenseNumber: "",
  email: "",
  phoneNumber: "",
  nationalId: "",
  profilePictureIsDeleted: false,
  profilePicture: undefined,
  nationalIdFront: undefined,
  nationalIdBack: undefined,
  drivingLicenseFront: undefined,
  drivingLicenseBack: undefined,
};
