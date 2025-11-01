import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegistration } from "@/hooks/useRegistration";
import {
  getSaudiArabiaId,
  useCitiesByCountry,
  useCountries,
} from "@/hooks/useCountriesAndCities";
import DocumentUpload from "./DocumentUpload";

const ClientSignUp: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState("section1");

  const { isLoading, error: apiError, register } = useRegistration();

  useEffect(() => {
    if (error || apiError) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, apiError]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    country: "",
    city: "",
    dateOfBirth: "",
    nationalId: "",
    licenseId: "",
    acceptTerms: false,
  });

  const [fileData, setFileData] = useState({
    nationalIdFront: null as File | null,
    nationalIdBack: null as File | null,
    drivingLicenseFront: null as File | null,
    drivingLicenseBack: null as File | null,
  });

  const { data: countries } = useCountries();
  const { data: cities } = useCitiesByCountry(formData.country);

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

    if (!fileData.nationalIdFront || !fileData.nationalIdBack) {
      setError(t("nationalIdRequired"));
      return false;
    }

    if (!fileData.drivingLicenseFront || !fileData.drivingLicenseBack) {
      setError(t("drivingLicenseRequired"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");

    try {
      const formDataObj = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataObj.append(key, value.toString());
        }
      });

      Object.entries(fileData).forEach(([key, file]) => {
        if (file) {
          formDataObj.append(key, file);
        }
      });

      formDataObj.append("userType", "client");

      const success = await register("client", formDataObj);

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
      console.error("Client signup error:", error);
      setError(error.message || t("signupError"));
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || apiError) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700">
                  {error || apiError}
                </span>
              </div>
            )}

            <Accordion
              type="single"
              collapsible
              value={expandedSection}
              onValueChange={setExpandedSection}
              className="w-full"
            >
              {/* Section 1: Basic Information */}
              <AccordionItem value="section1">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <span className={isRTL ? "mr-2" : "ml-2"}>📋</span>
                  {t("basicInformation")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
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
                          isRTL={isRTL}
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
                          isRTL={isRTL}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">{t("emailAddress")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        isRTL={isRTL}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">{t("phoneNumber")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        isRTL={isRTL}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 2: Personal Details */}
              <AccordionItem value="section2">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <span className={isRTL ? "mr-2" : "ml-2"}>👤</span>
                  {t("personalDetails")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="gender">{t("gender")}</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <SelectTrigger isRTL={isRTL}>
                            <SelectValue placeholder={t("selectGender")} />
                          </SelectTrigger>
                          <SelectContent isRTL={isRTL}>
                            <SelectItem value="male" isRTL={isRTL}>
                              {t("male")}
                            </SelectItem>
                            <SelectItem value="female" isRTL={isRTL}>
                              {t("female")}
                            </SelectItem>
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
                          isRTL={isRTL}
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
                          isRTL={isRTL}
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
                          <SelectTrigger isRTL={isRTL}>
                            <SelectValue placeholder={t("selectCountry")} />
                          </SelectTrigger>
                          <SelectContent isRTL={isRTL}>
                            {countries?.map((country) => (
                              <SelectItem
                                key={country.id}
                                value={country.id}
                                isRTL={isRTL}
                              >
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
                          <SelectTrigger isRTL={isRTL}>
                            <SelectValue placeholder={t("selectCity")} />
                          </SelectTrigger>
                          <SelectContent isRTL={isRTL}>
                            {cities?.map((city) => (
                              <SelectItem
                                key={city.id}
                                value={city.id}
                                isRTL={isRTL}
                              >
                                {language === "ar"
                                  ? city.name_ar
                                  : city.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="licenseId">
                        {t("drivingLicenseNumber")}
                      </Label>
                      <Input
                        id="licenseId"
                        type="text"
                        value={formData.licenseId}
                        onChange={(e) =>
                          handleInputChange("licenseId", e.target.value)
                        }
                        isRTL={isRTL}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 3: Documents */}
              <AccordionItem value="section3">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <span className={isRTL ? "mr-2" : "ml-2"}>📄</span>
                  {t("documentUploads")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
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
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 4: Security */}
              <AccordionItem value="section4">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <span className={isRTL ? "mr-2" : "ml-2"}>🔐</span>
                  {t("security")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
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
                            isRTL={isRTL}
                            required
                          />
                          <button
                            type="button"
                            className={cn(
                              "absolute inset-y-0 flex items-center pr-3",
                              isRTL && "left-0 pl-3 pr-0"
                            )}
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
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            isRTL={isRTL}
                            required
                          />
                          <button
                            type="button"
                            className={cn(
                              "absolute inset-y-0 flex items-center pr-3",
                              isRTL && "left-0 pl-3 pr-0"
                            )}
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-start gap-2 pt-4">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  handleInputChange("acceptTerms", e.target.checked)
                }
                className="h-4 w-4 text-primary border-gray-300 rounded mt-1"
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
  );
};

export default ClientSignUp;
