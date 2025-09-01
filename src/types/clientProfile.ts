// Client profile data - Updated to match real API response
export interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  gender: number;
  countryName: string;
  cityName: string;
  address: string;
  licenseNumber: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  profilePicture?: string;
  nationalIdFront?: string;
  nationalIdBack?: string;
  drivingLicenseFront?: string;
  drivingLicenseBack?: string;
  userId: string;
}

// Custom message from API
export interface CustomMessage {
  httpStatus: number;
  code: number;
  messageKey: string;
}

// The full API response
export interface ClientProfileResponse {
  data: ClientProfile;
  isSuccess: boolean;
  customMessage: CustomMessage;
}

// Profile update form data structure - Updated to match real API structure
export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  gender: number;
  countryName: string;
  cityName: string;
  address: string;
  licenseNumber: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  profilePictureIsDeleted: boolean;
  profilePicture?: File;
  nationalIdFront?: File;
  nationalIdBack?: File;
  drivingLicenseFront?: File;
  drivingLicenseBack?: File;
}
