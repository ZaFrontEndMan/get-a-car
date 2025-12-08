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
import { motion } from "framer-motion";

const ClientSignUp: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState("section1");

  const { isLoading, error: apiError, register } = useRegistration();

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    if (
      ["phone", "nationalId", "licenseId"].includes(field) &&
      typeof value === "string"
    ) {
      value =
        field === "phone"
          ? value.replace(/[^\d+]/g, "")
          : value.replace(/\D/g, "");
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    if (error) setError("");
  };

  const handleFileUpdate = (field: string, file: File | null) => {
    setFileData((prev) => ({ ...prev, [field]: file }));
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      errs.name = t("nameRequired");
    }
    if (!formData.email.trim()) {
      errs.email = t("emailRequired");
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = t("passwordMinLength");
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = t("passwordMismatch");
    }
    if (!formData.acceptTerms) {
      errs.acceptTerms = t("acceptTermsRequired");
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
        errs.dateOfBirth = t("mustBe18OrOlder");
      }
    }

    if (!fileData.nationalIdFront || !fileData.nationalIdBack) {
      errs.nationalIdFiles = t("nationalIdRequired");
    }

    if (!fileData.drivingLicenseFront || !fileData.drivingLicenseBack) {
      errs.drivingLicenseFiles = t("drivingLicenseRequired");
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      setError(Object.values(errs)[0]);
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-rose-50 border border-rose-200 rounded-md p-4 flex items-center gap-2"
              >
                <AlertCircle className="h-5 w-5 text-red flex-shrink-0" />
                <span className="text-sm text-red">
                  {error || apiError}
                </span>
              </motion.div>
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
                          placeholder={t("firstNamePlaceholder")}
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          isRTL={isRTL}
                          required
                        />
                        {fieldErrors.name && (
                          <motion.p
                            className="text-xs text-rose-600 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {fieldErrors.name}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t("lastName")}</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder={t("lastNamePlaceholder")}
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
                        placeholder={t("emailPlaceholder")}
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        isRTL={isRTL}
                        required
                      />
                      {fieldErrors.email && (
                        <motion.p
                          className="text-xs text-rose-600 mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {fieldErrors.email}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">{t("phoneNumber")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        isRTL={isRTL}
                      />
                      {fieldErrors.phone && (
                        <motion.p
                          className="text-xs text-rose-600 mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {fieldErrors.phone}
                        </motion.p>
                      )}
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
                            <SelectItem value="1" isRTL={isRTL}>
                              {t("male")}
                            </SelectItem>
                            <SelectItem value="2" isRTL={isRTL}>
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
                          placeholder={t("dateOfBirthPlaceholder")}
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          isRTL={isRTL}
                        />
                        {fieldErrors.dateOfBirth && (
                          <motion.p
                            className="text-xs text-rose-600 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {fieldErrors.dateOfBirth}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="nationalId">{t("nationalId")}</Label>
                        <Input
                          id="nationalId"
                          type="text"
                          placeholder={t("nationalIdPlaceholder")}
                          value={formData.nationalId}
                          onChange={(e) =>
                            handleInputChange("nationalId", e.target.value)
                          }
                          isRTL={isRTL}
                        />
                        {fieldErrors.nationalId && (
                          <motion.p
                            className="text-xs text-rose-600 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {fieldErrors.nationalId}
                          </motion.p>
                        )}
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
                        placeholder={t("licenseIdPlaceholder")}
                        value={formData.licenseId}
                        onChange={(e) =>
                          handleInputChange("licenseId", e.target.value)
                        }
                        isRTL={isRTL}
                      />
                      {fieldErrors.licenseId && (
                        <motion.p
                          className="text-xs text-rose-600 mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {fieldErrors.licenseId}
                        </motion.p>
                      )}
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

                    {/* File-level errors */}
                    {fieldErrors.nationalIdFiles && (
                      <motion.p
                        className="text-xs text-rose-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {fieldErrors.nationalIdFiles}
                      </motion.p>
                    )}
                    {fieldErrors.drivingLicenseFiles && (
                      <motion.p
                        className="text-xs text-rose-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {fieldErrors.drivingLicenseFiles}
                      </motion.p>
                    )}
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
                        <Label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t("password")}
                        </Label>
                        <motion.div
                          className="relative"
                          whileFocus={{ scale: 1.02 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t("passwordPlaceholder")}
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            isRTL={isRTL}
                            required
                            className={cn(
                              "w-full rounded-lg border-2 pe-12 transition-all duration-200",
                              "focus:outline-none",
                              fieldErrors.password
                                ? "border-red focus:border-red"
                                : ""
                            )}
                          />
                          <motion.button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowPassword(!showPassword);
                              e.currentTarget.blur();
                            }}
                            className={cn(
                              "absolute inset-y-0 end-0 flex items-center px-3 text-gray-500 hover:text-gray-700",
                              "focus:outline-none focus-visible:outline-none"
                            )}
                            tabIndex={-1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </motion.button>
                        </motion.div>
                        {fieldErrors.password && (
                          <motion.p
                            className="text-red text-xs mt-2 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span>✕</span> {fieldErrors.password}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t("confirmPassword")}
                        </label>
                        <motion.div
                          className="relative"
                          whileFocus={{ scale: 1.02 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("confirmPasswordPlaceholder")}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            isRTL={isRTL}
                            required
                            className={cn(
                              "w-full rounded-lg border-2 pe-12 transition-all duration-200",
                              "focus:outline-none",
                              fieldErrors.confirmPassword
                                ? "border-red focus:border-red"
                                : ""
                            )}
                          />
                          <motion.button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowConfirmPassword(!showConfirmPassword);
                              e.currentTarget.blur();
                            }}
                            className={cn(
                              "absolute inset-y-0 end-0 flex items-center px-3 text-gray-500 hover:text-gray-700",
                              "focus:outline-none focus-visible:outline-none"
                            )}
                            tabIndex={-1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </motion.button>
                        </motion.div>
                        {fieldErrors.confirmPassword && (
                          <motion.p
                            className="text-red text-xs mt-2 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span>✕</span> {fieldErrors.confirmPassword}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-start gap-2 pt-2">
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
                className="text-sm text-gray-700 dark:text-gray-800"
              >
                {t("agreeToTerms")}{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  {t("termsConditions")}
                </Link>
              </label>
            </div>
            {fieldErrors.acceptTerms && (
              <motion.p
                className="text-xs text-rose-600 -mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {fieldErrors.acceptTerms}
              </motion.p>
            )}

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
