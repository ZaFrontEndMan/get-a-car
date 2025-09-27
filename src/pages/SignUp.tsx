import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import {
  useCountries,
  useCitiesByCountry,
  getSaudiArabiaId,
} from "../hooks/useCountriesAndCities";
import { useRegistration } from "../hooks/useRegistration";
import UserTypeSwitcher from "../components/auth/UserTypeSwitcher";
import AuthHeader from "../components/auth/AuthHeader";
import AuthPageHeader from "../components/auth/AuthPageHeader";
import DocumentUpload from "../components/auth/DocumentUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const SignUp: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"client" | "vendor">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { isLoading, error: apiError, register } = useRegistration();

  // Auto-scroll to top when error occurs
  useEffect(() => {
    if (error || apiError) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, apiError]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    businessLicense: "",
    gender: "",
    country: "",
    city: "",
    dateOfBirth: "",
    nationalId: "",
    licenseId: "",
    acceptTerms: false,
  });

  // File state for document uploads
  const [fileData, setFileData] = useState({
    nationalIdFront: null as File | null,
    nationalIdBack: null as File | null,
    licenseIdFront: null as File | null,
    licenseIdBack: null as File | null,
    drivingLicenseFront: null as File | null,
    drivingLicenseBack: null as File | null,
  });

  // Countries and cities data
  const { data: countries } = useCountries();
  const { data: cities } = useCitiesByCountry(formData.country);

  // Set default country to Saudi Arabia
  React.useEffect(() => {
    const setDefaultCountry = async () => {
      const saudiId = await getSaudiArabiaId();
      if (saudiId && !formData.country) {
        setFormData((prev) => ({ ...prev, country: saudiId }));
      }
    };
    setDefaultCountry();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleFileUpdate = (field: string, file: File | null) => {
    setFileData((prev) => ({ ...prev, [field]: file }));
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError(t("nameRequired"));
      return false;
    }
    if (!formData.email.trim()) {
      setError(t("emailRequired"));
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError(t("passwordMinLength"));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"));
      return false;
    }
    if (!formData.acceptTerms) {
      setError(t("acceptTermsRequired"));
      return false;
    }

    // Vendor-specific validation
    if (userType === "vendor") {
      if (!formData.companyName.trim()) {
        setError(t("companyNameRequired"));
        return false;
      }
      if (!formData.businessLicense.trim()) {
        setError(t("businessLicenseRequired"));
        return false;
      }
    }

    // Age validation for date of birth
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      if (calculatedAge < 18) {
        setError(t("mustBe18OrOlder"));
        return false;
      }
    }

    // File validation - require national ID front and back for all users
    if (!fileData.nationalIdFront || !fileData.nationalIdBack) {
      setError(t("nationalIdRequired"));
      return false;
    }

    // Vendor-specific file validation
    if (userType === "vendor") {
      if (!fileData.licenseIdFront || !fileData.licenseIdBack) {
        setError(t("businessLicenseRequired"));
        return false;
      }
    } else {
      // Client-specific file validation
      if (!fileData.drivingLicenseFront || !fileData.drivingLicenseBack) {
        setError(t("drivingLicenseRequired"));
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");

    try {
      // Create FormData object
      const formDataObj = new FormData();

      // Add all form data fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataObj.append(key, value.toString());
        }
      });

      // Add all file data
      Object.entries(fileData).forEach(([key, file]) => {
        if (file) {
          formDataObj.append(key, file);
        }
      });

      // Add user type
      formDataObj.append("userType", userType);

      const success = await register(userType, formDataObj);

      if (success) {
        navigate("/signin", {
          state: {
            message: t("registrationSuccessful"),
            type: "success",
          },
        });
      } else if (apiError) {
        setError(apiError);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || t("signupError"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col"> 
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-primary">
          {t("createAccount")}
        </h2>{" "}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <UserTypeSwitcher
                  userType={userType}
                  onUserTypeChange={setUserType}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {(error || apiError) && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-700">
                      {error || apiError}
                    </span>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Vendor-specific fields */}
                {userType === "vendor" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">{t("companyName")}</Label>
                      <Input
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessLicense">
                        {t("businessLicense")}
                      </Label>
                      <Input
                        id="businessLicense"
                        type="text"
                        value={formData.businessLicense}
                        onChange={(e) =>
                          handleInputChange("businessLicense", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email">{t("emailAddress")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t("phoneNumber")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gender">{t("gender")}</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectGender")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t("male")}</SelectItem>
                        <SelectItem value="female">{t("female")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationalId">{t("nationalId")}</Label>
                    <Input
                      id="nationalId"
                      type="text"
                      value={formData.nationalId}
                      onChange={(e) =>
                        handleInputChange("nationalId", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">{t("country")}</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCountry")} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries?.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            {language === "ar"
                              ? country.name_ar
                              : country.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city">{t("city")}</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) =>
                        handleInputChange("city", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCity")} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities?.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {language === "ar" ? city.name_ar : city.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="licenseId">{t("drivingLicenseNumber")}</Label>
                  <Input
                    id="licenseId"
                    type="text"
                    value={formData.licenseId}
                    onChange={(e) =>
                      handleInputChange("licenseId", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("documentUploads")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentUpload
                      title={t("nationalIdFront")}
                      documentType="national_id"
                      side="front"
                      onImageUpdate={(file) =>
                        handleFileUpdate("nationalIdFront", file)
                      }
                      currentImageFile={fileData.nationalIdFront}
                    />
                    <DocumentUpload
                      title={t("nationalIdBack")}
                      documentType="national_id"
                      side="back"
                      onImageUpdate={(file) =>
                        handleFileUpdate("nationalIdBack", file)
                      }
                      currentImageFile={fileData.nationalIdBack}
                    />
                  </div>

                  {userType === "vendor" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DocumentUpload
                        title={t("licenseIdFront")}
                        documentType="license_id"
                        side="front"
                        onImageUpdate={(file) =>
                          handleFileUpdate("licenseIdFront", file)
                        }
                        currentImageFile={fileData.licenseIdFront}
                      />
                      <DocumentUpload
                        title={t("licenseIdBack")}
                        documentType="license_id"
                        side="back"
                        onImageUpdate={(file) =>
                          handleFileUpdate("licenseIdBack", file)
                        }
                        currentImageFile={fileData.licenseIdBack}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DocumentUpload
                        title={t("drivingLicenseFront")}
                        documentType="driving_license"
                        side="front"
                        onImageUpdate={(file) =>
                          handleFileUpdate("drivingLicenseFront", file)
                        }
                        currentImageFile={fileData.drivingLicenseFront}
                      />
                      <DocumentUpload
                        title={t("drivingLicenseBack")}
                        documentType="driving_license"
                        side="back"
                        onImageUpdate={(file) =>
                          handleFileUpdate("drivingLicenseBack", file)
                        }
                        currentImageFile={fileData.drivingLicenseBack}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">{t("password")}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        required 
                        className=" text-end"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      {t("confirmPassword")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        required 
                        className=" text-end"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      handleInputChange("acceptTerms", e.target.checked)
                    }
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {t("agreeToTerms")}{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      {t("termsConditions")}
                    </Link>
                  </label>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? t("creatingAccount") : t("createAccount")}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {t("alreadyHaveAccount")}{" "}
                  <Link to="/signin" className="text-primary hover:underline">
                    {t("signInHere")}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
