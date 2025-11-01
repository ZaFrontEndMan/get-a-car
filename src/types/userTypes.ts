/**
 * Consolidated User Details Interface
 * Contains both authentication and personal information
 */
export interface UserDetails {
  // UserData fields
  Password: string;
  UserName: string;
  IsPhone: boolean;

  // UserDetails fields
  City: number;
  Country: number;
  Email: string;
  FirstName: string;
  FullName: string;
  LastName: string;
  NationalId: number;
  PhoneNumber: string;
  BirthDate: string; // ISO 8601 format: YYYY-MM-DD
  Gender: number; // 0 = Male, 1 = Female
  LicenseNumber: string;

  // Document uploads
  DrivingLicenseFront?: File;
  DrivingLicenseBack?: File;
  NationalIdFront?: File;
  NationalIdBack?: File;
}

/**
 * Registration Payload Type
 */
export type RegistrationPayload = UserDetails & {
  userType: "client" | "vendor";
  acceptTerms: boolean;
  confirmPassword?: string;
};
