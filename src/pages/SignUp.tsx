import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import {
  useCountries,
  useCitiesByCountry,
  getSaudiArabiaId,
} from "../hooks/useCountriesAndCities";
import { useRegistration } from "../hooks/useRegistration";
import UserTypeSwitcher from "../components/auth/UserTypeSwitcher";
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 },
};

const slideDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.1 },
};

const slideUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.2 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, delay: 0.2 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const errorAnimation = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.3 },
};

const SignUp: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === "ar";
  const [userType, setUserType] = useState<"client" | "vendor">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState("section1");

  const { isLoading, error: apiError, register } = useRegistration();

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // KSA validators
  const saPhoneRegex =
    /^(?:\+?9665\d{8}|009665\d{8}|9665\d{8}|05\d{8}|5\d{8})$/;

  const isValidSaudiPhone = (value: string): boolean => {
    if (!value) return false;
    const cleaned = value.replace(/[\s-().]/g, "");
    return saPhoneRegex.test(cleaned);
  };

  const isValidSaudiNationalId = (id: string): boolean => {
    if (!id) return false;
    const cleaned = id.replace(/\s/g, "");
    if (cleaned.length !== 10) return false;
    if (cleaned.startsWith("0")) return false;
    return /^\d{10}$/.test(cleaned);
  };

  const isValidSaudiLicense = (value: string) => /^\d{10}$/.test(value.trim());

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

  const [fileData, setFileData] = useState({
    nationalIdFront: null as File | null,
    nationalIdBack: null as File | null,
    licenseIdFront: null as File | null,
    licenseIdBack: null as File | null,
    drivingLicenseFront: null as File | null,
    drivingLicenseBack: null as File | null,
  });

  const { data: countries } = useCountries();
  const { data: cities } = useCitiesByCountry(formData.country);

  useEffect(() => {
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

    if (formData.phone && !isValidSaudiPhone(formData.phone)) {
      errs.phone = t("invalidSaudiPhone") || "Invalid Saudi phone number";
    }

    if (!formData.nationalId) {
      errs.nationalId = t("nationalIdRequired");
    } else if (!isValidSaudiNationalId(formData.nationalId)) {
      errs.nationalId =
        t("invalidSaudiNationalId") || "Invalid Saudi National ID";
    }

    if (userType === "vendor") {
      if (!formData.companyName.trim()) {
        errs.companyName = t("companyNameRequired");
      }
      if (!formData.businessLicense.trim()) {
        errs.businessLicense = t("businessLicenseRequired");
      }
    } else {
      if (!formData.licenseId) {
        errs.licenseId = t("drivingLicenseRequired");
      } else if (!isValidSaudiLicense(formData.licenseId)) {
        errs.licenseId =
          t("invalidSaudiLicense") || "Invalid Saudi driving license number";
      }
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
    if (userType === "vendor") {
      if (!fileData.licenseIdFront || !fileData.licenseIdBack) {
        errs.vendorLicenseFiles = t("businessLicenseRequired");
      }
    } else {
      if (!fileData.drivingLicenseFront || !fileData.drivingLicenseBack) {
        errs.drivingLicenseFiles = t("drivingLicenseRequired");
      }
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
      // Create UserDetails object based on user type
      const baseDetails = {
        Password: formData.password,
        UserName: formData.email,
        ConfirmPassword: formData.confirmPassword,
        IsPhone: false,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        FullName: `${formData.firstName} ${formData.lastName}`,
        Email: formData.email,
        PhoneNumber: formData.phone,
        Gender: parseInt(formData.gender),
        Country: parseInt(formData.country),
        City: parseInt(formData.city),
        DateOfBirth: formData.dateOfBirth,
        NationalId: formData.nationalId,
        AcceptTerms: formData.acceptTerms,
        UserType: userType,
      };

      let userDetails: UserDetails;

      if (userType === "client") {
        userDetails = {
          ...baseDetails,
          LicenseId: formData.licenseId,
        } as ClientUserDetails;
      } else {
        userDetails = {
          ...baseDetails,
          CompanyName: formData.companyName,
          BusinessLicense: formData.businessLicense,
        } as VendorUserDetails;
      }

      // Prepare documents based on user type
      const documents =
        userType === "client"
          ? {
              DrivingLicenseFront: fileData.drivingLicenseFront,
              DrivingLicenseBack: fileData.drivingLicenseBack,
              NationalIdFront: fileData.nationalIdFront,
              NationalIdBack: fileData.nationalIdBack,
            }
          : {
              LicenseIdFront: fileData.licenseIdFront,
              LicenseIdBack: fileData.licenseIdBack,
              NationalIdFront: fileData.nationalIdFront,
              NationalIdBack: fileData.nationalIdBack,
            };

      // Register with the hook
      const success = await register(userType, userDetails, documents);

      if (success) {
        toast.success(t("success_title"));
        navigate("/signin", {
          state: {
            message: t("registrationSuccessful"),
            type: "success",
          },
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      console.log(error);

      setError(error.response?.data?.error?.message || t("signupError"));
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      {/* Header with Logo */}
      <motion.div
        className="py-8 px-4 flex flex-col items-center justify-center"
        variants={slideDown}
        initial="initial"
        animate="animate"
      >
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="h-14 w-auto mb-4 cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onClick={() => {
            navigate("/");
          }}
        />
        <motion.h2
          className="text-3xl font-bold text-center text-white drop-shadow-sm"
          variants={staggerItem}
          initial="initial"
          animate="animate"
        >
          {t("createAccount")}
        </motion.h2>
      </motion.div>

      <motion.div
        className="flex-1 flex flex-col justify-center pb-12 sm:px-6 lg:px-8"
        variants={slideUp}
        initial="initial"
        animate="animate"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
          <motion.div variants={scaleIn} initial="initial" animate="animate">
            <Card className="shadow-2xl border-0">
              <CardHeader>
                <motion.div variants={staggerItem}>
                  <CardTitle className="text-center">
                    <UserTypeSwitcher
                      userType={userType}
                      onUserTypeChange={setUserType}
                    />
                  </CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Alert */}
                  {(error || apiError) && (
                    <motion.div
                      variants={errorAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
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
                    <motion.div variants={staggerItem}>
                      <AccordionItem value="section1">
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                          <span className={isRTL ? "mr-2" : "ml-2"}>📋</span>
                          {t("basicInformation")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <motion.div
                            className="space-y-4"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <motion.div variants={staggerItem}>
                                <Label htmlFor="firstName">
                                  {t("firstName")}
                                </Label>
                                <Input
                                  id="firstName"
                                  type="text"
                                  placeholder={t("firstNamePlaceholder")}
                                  value={formData.firstName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "firstName",
                                      e.target.value
                                    )
                                  }
                                  isRTL={isRTL}
                                  required
                                />
                                {fieldErrors.name && (
                                  <motion.p
                                    className="text-xs text-rose-600 mt-1"
                                    variants={errorAnimation}
                                    initial="initial"
                                    animate="animate"
                                  >
                                    {fieldErrors.name}
                                  </motion.p>
                                )}
                              </motion.div>
                              <motion.div variants={staggerItem}>
                                <Label htmlFor="lastName">
                                  {t("lastName")}
                                </Label>
                                <Input
                                  id="lastName"
                                  type="text"
                                  placeholder={t("lastNamePlaceholder")}
                                  value={formData.lastName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "lastName",
                                      e.target.value
                                    )
                                  }
                                  isRTL={isRTL}
                                  required
                                />
                              </motion.div>
                            </div>

                            <motion.div variants={staggerItem}>
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
                                  variants={errorAnimation}
                                  initial="initial"
                                  animate="animate"
                                >
                                  {fieldErrors.email}
                                </motion.p>
                              )}
                            </motion.div>

                            <motion.div variants={staggerItem}>
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
                                  variants={errorAnimation}
                                  initial="initial"
                                  animate="animate"
                                >
                                  {fieldErrors.phone}
                                </motion.p>
                              )}
                            </motion.div>

                            {userType === "vendor" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div variants={staggerItem}>
                                  <Label htmlFor="companyName">
                                    {t("companyName")}
                                  </Label>
                                  <Input
                                    id="companyName"
                                    type="text"
                                    placeholder={t("companyNamePlaceholder")}
                                    value={formData.companyName}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "companyName",
                                        e.target.value
                                      )
                                    }
                                    isRTL={isRTL}
                                    required
                                  />
                                  {fieldErrors.companyName && (
                                    <motion.p
                                      className="text-xs text-rose-600 mt-1"
                                      variants={errorAnimation}
                                      initial="initial"
                                      animate="animate"
                                    >
                                      {fieldErrors.companyName}
                                    </motion.p>
                                  )}
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                  <Label htmlFor="businessLicense">
                                    {t("businessLicense")}
                                  </Label>
                                  <Input
                                    id="businessLicense"
                                    type="text"
                                    placeholder={t(
                                      "businessLicensePlaceholder"
                                    )}
                                    value={formData.businessLicense}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "businessLicense",
                                        e.target.value
                                      )
                                    }
                                    isRTL={isRTL}
                                    required
                                  />
                                  {fieldErrors.businessLicense && (
                                    <motion.p
                                      className="text-xs text-rose-600 mt-1"
                                      variants={errorAnimation}
                                      initial="initial"
                                      animate="animate"
                                    >
                                      {fieldErrors.businessLicense}
                                    </motion.p>
                                  )}
                                </motion.div>
                              </div>
                            )}
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>

                    {/* Section 2: Personal Details */}
                    <motion.div variants={staggerItem}>
                      <AccordionItem value="section2">
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                          <span className={isRTL ? "mr-2" : "ml-2"}>👤</span>
                          {t("personalDetails")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <motion.div
                            className="space-y-4"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <motion.div variants={staggerItem}>
                                <Label htmlFor="gender">{t("gender")}</Label>
                                <Select
                                  value={formData.gender}
                                  onValueChange={(value) =>
                                    handleInputChange("gender", value)
                                  }
                                >
                                  <SelectTrigger isRTL={isRTL}>
                                    <SelectValue
                                      placeholder={t("selectGender")}
                                    />
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
                              </motion.div>
                              <motion.div variants={staggerItem}>
                                <Label htmlFor="dateOfBirth">
                                  {t("dateOfBirth")}
                                </Label>
                                <Input
                                  id="dateOfBirth"
                                  type="date"
                                  placeholder={t("dateOfBirthPlaceholder")}
                                  value={formData.dateOfBirth}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "dateOfBirth",
                                      e.target.value
                                    )
                                  }
                                  isRTL={isRTL}
                                />
                                {fieldErrors.dateOfBirth && (
                                  <motion.p
                                    className="text-xs text-rose-600 mt-1"
                                    variants={errorAnimation}
                                    initial="initial"
                                    animate="animate"
                                  >
                                    {fieldErrors.dateOfBirth}
                                  </motion.p>
                                )}
                              </motion.div>
                              <motion.div variants={staggerItem}>
                                <Label htmlFor="nationalId">
                                  {t("nationalId")}
                                </Label>
                                <Input
                                  id="nationalId"
                                  type="text"
                                  placeholder={t("nationalIdPlaceholder")}
                                  value={formData.nationalId}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "nationalId",
                                      e.target.value
                                    )
                                  }
                                  isRTL={isRTL}
                                />
                                {fieldErrors.nationalId && (
                                  <motion.p
                                    className="text-xs text-rose-600 mt-1"
                                    variants={errorAnimation}
                                    initial="initial"
                                    animate="animate"
                                  >
                                    {fieldErrors.nationalId}
                                  </motion.p>
                                )}
                              </motion.div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <motion.div variants={staggerItem}>
                                <Label htmlFor="country">{t("country")}</Label>
                                <Select
                                  value={formData.country}
                                  onValueChange={(value) =>
                                    handleInputChange("country", value)
                                  }
                                >
                                  <SelectTrigger isRTL={isRTL}>
                                    <SelectValue
                                      placeholder={t("selectCountry")}
                                    />
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
                              </motion.div>
                              <motion.div variants={staggerItem}>
                                <Label htmlFor="city">{t("city")}</Label>
                                <Select
                                  value={formData.city}
                                  onValueChange={(value) =>
                                    handleInputChange("city", value)
                                  }
                                >
                                  <SelectTrigger isRTL={isRTL}>
                                    <SelectValue
                                      placeholder={t("selectCity")}
                                    />
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
                              </motion.div>
                            </div>

                            {userType !== "vendor" && (
                              <motion.div variants={staggerItem}>
                                <Label htmlFor="licenseId">
                                  {t("drivingLicenseNumber")}
                                </Label>
                                <Input
                                  id="licenseId"
                                  type="text"
                                  placeholder={t("licenseIdPlaceholder")}
                                  value={formData.licenseId}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "licenseId",
                                      e.target.value
                                    )
                                  }
                                  isRTL={isRTL}
                                />
                                {fieldErrors.licenseId && (
                                  <motion.p
                                    className="text-xs text-rose-600 mt-1"
                                    variants={errorAnimation}
                                    initial="initial"
                                    animate="animate"
                                  >
                                    {fieldErrors.licenseId}
                                  </motion.p>
                                )}
                              </motion.div>
                            )}
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>

                    {/* Section 3: Documents */}
                    <motion.div variants={staggerItem}>
                      <AccordionItem value="section3">
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                          <span className={isRTL ? "mr-2" : "ml-2"}>📄</span>
                          {t("documentUploads")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <motion.div
                            className="space-y-6"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                          >
                            <motion.div
                              className="grid grid-cols-1 md:grid-cols-2 gap-6"
                              variants={staggerContainer}
                              initial="initial"
                              animate="animate"
                            >
                              <motion.div variants={staggerItem}>
                                <DocumentUpload
                                  title={t("nationalIdFront")}
                                  documentType="national_id"
                                  side="front"
                                  onImageUpdate={(file) =>
                                    handleFileUpdate("nationalIdFront", file)
                                  }
                                  currentImageFile={fileData.nationalIdFront}
                                />
                              </motion.div>
                              <motion.div variants={staggerItem}>
                                <DocumentUpload
                                  title={t("nationalIdBack")}
                                  documentType="national_id"
                                  side="back"
                                  onImageUpdate={(file) =>
                                    handleFileUpdate("nationalIdBack", file)
                                  }
                                  currentImageFile={fileData.nationalIdBack}
                                />
                              </motion.div>
                            </motion.div>

                            {userType === "vendor" ? (
                              <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                              >
                                <motion.div variants={staggerItem}>
                                  <DocumentUpload
                                    title={t("licenseIdFront")}
                                    documentType="license_id"
                                    side="front"
                                    onImageUpdate={(file) =>
                                      handleFileUpdate("licenseIdFront", file)
                                    }
                                    currentImageFile={fileData.licenseIdFront}
                                  />
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                  <DocumentUpload
                                    title={t("licenseIdBack")}
                                    documentType="license_id"
                                    side="back"
                                    onImageUpdate={(file) =>
                                      handleFileUpdate("licenseIdBack", file)
                                    }
                                    currentImageFile={fileData.licenseIdBack}
                                  />
                                </motion.div>
                              </motion.div>
                            ) : (
                              <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                              >
                                <motion.div variants={staggerItem}>
                                  <DocumentUpload
                                    title={t("drivingLicenseFront")}
                                    documentType="driving_license"
                                    side="front"
                                    onImageUpdate={(file) =>
                                      handleFileUpdate(
                                        "drivingLicenseFront",
                                        file
                                      )
                                    }
                                    currentImageFile={
                                      fileData.drivingLicenseFront
                                    }
                                  />
                                </motion.div>
                                <motion.div variants={staggerItem}>
                                  <DocumentUpload
                                    title={t("drivingLicenseBack")}
                                    documentType="driving_license"
                                    side="back"
                                    onImageUpdate={(file) =>
                                      handleFileUpdate(
                                        "drivingLicenseBack",
                                        file
                                      )
                                    }
                                    currentImageFile={
                                      fileData.drivingLicenseBack
                                    }
                                  />
                                </motion.div>
                              </motion.div>
                            )}

                            {/* File-level errors */}
                            {fieldErrors.nationalIdFiles && (
                              <motion.p
                                className="text-xs text-rose-600"
                                variants={errorAnimation}
                                initial="initial"
                                animate="animate"
                              >
                                {fieldErrors.nationalIdFiles}
                              </motion.p>
                            )}
                            {userType === "vendor" &&
                              fieldErrors.vendorLicenseFiles && (
                                <motion.p
                                  className="text-xs text-rose-600"
                                  variants={errorAnimation}
                                  initial="initial"
                                  animate="animate"
                                >
                                  {fieldErrors.vendorLicenseFiles}
                                </motion.p>
                              )}
                            {userType !== "vendor" &&
                              fieldErrors.drivingLicenseFiles && (
                                <motion.p
                                  className="text-xs text-rose-600"
                                  variants={errorAnimation}
                                  initial="initial"
                                  animate="animate"
                                >
                                  {fieldErrors.drivingLicenseFiles}
                                </motion.p>
                              )}
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>

                    {/* Section 4: Security */}
                    <motion.div variants={staggerItem}>
                      <AccordionItem value="section4">
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                          <span>🔐</span>
                          {t("security")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <motion.div
                            className="space-y-4"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <motion.div variants={staggerItem}>
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
                                      handleInputChange(
                                        "password",
                                        e.target.value
                                      )
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
                              </motion.div>

                              <motion.div variants={staggerItem}>
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
                                    type={
                                      showConfirmPassword ? "text" : "password"
                                    }
                                    placeholder={t(
                                      "confirmPasswordPlaceholder"
                                    )}
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
                                      setShowConfirmPassword(
                                        !showConfirmPassword
                                      );
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
                              </motion.div>
                            </div>
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  </Accordion>

                  {/* Terms and Conditions */}
                  <motion.div
                    className="flex items-start gap-2 pt-2"
                    variants={staggerItem}
                  >
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
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        {t("termsConditions")}
                      </Link>
                    </label>
                  </motion.div>
                  {fieldErrors.acceptTerms && (
                    <motion.p
                      className="text-xs text-rose-600 -mt-2"
                      variants={errorAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      {fieldErrors.acceptTerms}
                    </motion.p>
                  )}

                  {/* Submit Button */}
                  <motion.div
                    variants={staggerItem}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? t("creatingAccount") : t("createAccount")}
                    </Button>
                  </motion.div>

                  {/* Sign In Link */}
                  <motion.div
                    className="text-center text-sm text-gray-700"
                    variants={staggerItem}
                  >
                    {t("alreadyHaveAccount")}{" "}
                    <Link to="/signin" className="text-primary hover:underline">
                      {t("signInHere")}
                    </Link>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;
