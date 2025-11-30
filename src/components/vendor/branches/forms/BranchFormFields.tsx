import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCountries,
  useCitiesByCountry,
  Country,
  City,
} from "@/hooks/useCountriesAndCities";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { encryptPassword } from "@/utils/encryptPassword";
import { Eye, EyeOff } from "lucide-react";

interface BranchFormFieldsProps {
  formData: any;
  errors?: any;
  onFieldChange: (field: string, value: any) => void;
  t: (key: string) => string;
  isEditing: boolean;
}

export function BranchFormFields({
  formData,
  errors,
  onFieldChange,
  t,
  isEditing,
}: BranchFormFieldsProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [showPassword, setShowPassword] = useState(false);

  // Local state to store the plain text password for display
  const [plainPassword, setPlainPassword] = useState("");

  // Countries and cities queries
  const countryValue = formData.country ? String(formData.country) : "";
  const cityValue = formData.city ? String(formData.city) : "";

  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: cities, isLoading: citiesLoading } = useCitiesByCountry(
    countryValue || null
  );

  // Auto-sync fullName with managerName
  useEffect(() => {
    if (formData.managerName) {
      onFieldChange("fullName", formData.managerName);
    }
  }, [formData.managerName]);

  // Auto-sync userName based on isPhone
  useEffect(() => {
    if (!isEditing) {
      if (formData.isPhone) {
        onFieldChange("userName", formData.phoneNumber || "");
      } else {
        onFieldChange("userName", formData.email || "");
      }
    }
  }, [formData.isPhone, formData.phoneNumber, formData.email, isEditing]);

  const handleCountryChange = (value: string) => {
    const numericValue = value ? parseInt(value) : null;
    onFieldChange("country", numericValue);
    onFieldChange("city", null);
  };

  const handleCityChange = (value: string) => {
    const numericValue = value ? parseInt(value) : null;
    onFieldChange("city", numericValue);
  };

  const handleSimpleInputChange = (field: string, value: string) => {
    onFieldChange(field, value);
  };

  // Handle password change with encryption
  const handlePasswordChange = (value: string) => {
    setPlainPassword(value); // Store plain text for the input field

    if (value.trim() === "") {
      // If password is empty, pass empty string
      onFieldChange("password", "");
    } else {
      // Encrypt the password before passing to parent
      const encrypted = encryptPassword(value);
      onFieldChange("password", encrypted);
    }
  };

  // ===== COMMON FIELDS (shown in both create and edit modes) =====
  return (
    <div className="space-y-6">
      {/* Row 1: Branch Name + Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nickName">{t("branchNameLabel")}</Label>
          <Input
            id="nickName"
            placeholder={t("branchNamePlaceholder")}
            value={formData.nickName || ""}
            onChange={(e) =>
              handleSimpleInputChange("nickName", e.target.value)
            }
            className={errors?.nickName ? "border-destructive" : ""}
          />
          {errors?.nickName && (
            <p className="text-sm text-destructive">{errors.nickName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t("addressLabel")}</Label>
          <Input
            id="address"
            placeholder={t("addressPlaceholder")}
            value={formData.address || ""}
            onChange={(e) => handleSimpleInputChange("address", e.target.value)}
            className={errors?.address ? "border-destructive" : ""}
          />
          {errors?.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
        </div>
      </div>

      {/* Row 2: Manager Name + National ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="managerName">{t("managerNameLabel")}</Label>
          <Input
            id="managerName"
            placeholder={t("managerNamePlaceholder")}
            value={formData.managerName || ""}
            onChange={(e) =>
              handleSimpleInputChange("managerName", e.target.value)
            }
            className={errors?.managerName ? "border-destructive" : ""}
          />
          {errors?.managerName && (
            <p className="text-sm text-destructive">{errors.managerName}</p>
          )}
        </div>

        {/* National ID - Always visible */}
        <div className="space-y-2">
          <Label htmlFor="nationalId">{t("nationalIdLabel")}</Label>
          <Input
            id="nationalId"
            placeholder={t("nationalIdPlaceholder")}
            value={formData.nationalId || ""}
            onChange={(e) =>
              handleSimpleInputChange("nationalId", e.target.value)
            }
            className={errors?.nationalId ? "border-destructive" : ""}
          />
          {errors?.nationalId && (
            <p className="text-sm text-destructive">{errors.nationalId}</p>
          )}
        </div>
      </div>

      {/* Row 3: Email + Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formData.email || ""}
            onChange={(e) => handleSimpleInputChange("email", e.target.value)}
            className={errors?.email ? "border-destructive" : ""}
          />
          {errors?.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("enterPassword")}
              value={plainPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={
                errors?.password ? "border-destructive pe-10" : "pe-10"
              }
            />
            <button
              type="button"
              className="absolute end-2 top-3 text-muted-foreground hover:text-foreground transition"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors?.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>
      </div>

      {/* Row 4: Phone Number + Checkbox (isPhone) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">{t("phoneNumberLabel")}</Label>
          <Input
            id="phoneNumber"
            placeholder={t("phoneNumberPlaceholder")}
            value={formData.phoneNumber || ""}
            onChange={(e) =>
              handleSimpleInputChange("phoneNumber", e.target.value)
            }
            className={errors?.phoneNumber ? "border-destructive" : ""}
          />
          {errors?.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber}</p>
          )}
        </div>

        {/* isPhone Checkbox - Only in creation mode */}
        {!isEditing && (
          <div className="space-y-2">
            <Label className="block">&nbsp;</Label>
            <div className="flex items-center gap-2 h-10 border border-input rounded-md px-3 bg-background hover:bg-accent transition cursor-pointer">
              <Checkbox
                id="isPhone"
                checked={!!formData.isPhone}
                onCheckedChange={(checked) =>
                  onFieldChange("isPhone", !!checked)
                }
                className="cursor-pointer"
              />
              <Label
                htmlFor="isPhone"
                className="cursor-pointer flex-1 !m-0 text-sm"
              >
                {t("isPhoneLabel")}
              </Label>
            </div>
          </div>
        )}
      </div>

      {/* CREATION-ONLY FIELDS */}
      {!isEditing && (
        <>
          {/* Row 5: Country + City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">{t("countryLabel")}</Label>
              <Select
                value={countryValue}
                onValueChange={handleCountryChange}
                disabled={countriesLoading}
              >
                <SelectTrigger
                  className={errors?.country ? "border-destructive" : ""}
                >
                  <SelectValue placeholder={t("selectCountry")} />
                </SelectTrigger>
                <SelectContent>
                  {countriesLoading ? (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      {t("loading")}
                    </div>
                  ) : countries && countries.length > 0 ? (
                    countries.map((country: Country) => (
                      <SelectItem key={country.id} value={String(country.id)}>
                        {isRTL ? country.name_ar : country.name_en}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      {t("noCountriesAvailable")}
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors?.country && (
                <p className="text-sm text-destructive">{errors.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t("cityLabel")}</Label>
              <Select
                value={cityValue}
                onValueChange={handleCityChange}
                disabled={citiesLoading || !countryValue || countriesLoading}
              >
                <SelectTrigger
                  className={errors?.city ? "border-destructive" : ""}
                >
                  <SelectValue
                    placeholder={
                      !countryValue ? t("selectCountryFirst") : t("selectCity")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {citiesLoading ? (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      {t("loading")}
                    </div>
                  ) : !countryValue ? (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      {t("selectCountryFirst")}
                    </div>
                  ) : cities && cities.length > 0 ? (
                    cities.map((city: City) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {isRTL ? city.name_ar : city.name_en}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      {t("noCitiesAvailable")}
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors?.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Row 6: Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("notesLabel")}</Label>
            <Textarea
              id="notes"
              placeholder={t("notesPlaceholder")}
              value={formData.notes || ""}
              onChange={(e) => handleSimpleInputChange("notes", e.target.value)}
              className="resize-none"
            />
          </div>

          {/* Row 7: Can Make Offer Checkbox */}
          <div className="flex items-center gap-2 border border-input rounded-md p-3 bg-background hover:bg-accent transition">
            <Checkbox
              id="canMakeOffer"
              checked={!!formData.canMakeOffer}
              onCheckedChange={(checked) =>
                onFieldChange("canMakeOffer", !!checked)
              }
              className="cursor-pointer"
            />
            <Label htmlFor="canMakeOffer" className="cursor-pointer !m-0">
              {t("canMakeOfferLabel")}
            </Label>
          </div>
        </>
      )}

      {/* Hidden Fields - Auto-synced (not displayed) */}
      <input
        type="hidden"
        value={formData.fullName || ""}
        onChange={(e) => handleSimpleInputChange("fullName", e.target.value)}
      />
      <input
        type="hidden"
        value={formData.userName || ""}
        onChange={(e) => handleSimpleInputChange("userName", e.target.value)}
      />
    </div>
  );
}

export default BranchFormFields;
