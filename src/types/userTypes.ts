/**
 * Base User Data (Common for Client & Vendor)
 */
export interface BaseUserDetails {
  Password: string;
  UserName: string;
  ConfirmPassword: string;
  IsPhone: boolean;
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Gender: number;
  Country: number;
  City: number;
  DateOfBirth: string;
  NationalId: string;
  AcceptTerms: boolean;
  UserType: "client" | "vendor";
}

/**
 * Client Specific Details
 */
export interface ClientUserDetails extends BaseUserDetails {
  LicenseId: string;
}

/**
 * Vendor Specific Details
 */
export interface VendorUserDetails extends BaseUserDetails {
  CompanyName: string;
  BusinessLicense: string;
}

/**
 * Combined User Details Type (discriminated union)
 */
export type UserDetails = ClientUserDetails | VendorUserDetails;

/**
 * Registration Payload with Documents
 */
export interface RegistrationPayload {
  UserDetails: UserDetails;
  DrivingLicenseFront?: File;
  DrivingLicenseBack?: File;
  NationalIdFront?: File;
  NationalIdBack?: File;
  LicenseIdFront?: File;
  LicenseIdBack?: File;
}
