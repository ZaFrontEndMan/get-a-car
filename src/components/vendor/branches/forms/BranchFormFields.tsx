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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Basic Fields - shown in both modes */}
      <div className="space-y-2">
        <Label htmlFor="nickName">{t("branchNameLabel")}</Label>
        <Input
          id="nickName"
          placeholder={t("branchNamePlaceholder")}
          value={formData.nickName || ""}
          onChange={(e) => handleSimpleInputChange("nickName", e.target.value)}
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

      <div className="space-y-2">
        <Label htmlFor="fullName">{t("fullNameLabel")}</Label>
        <Input
          id="fullName"
          placeholder={t("fullNamePlaceholder")}
          value={formData.fullName || ""}
          onChange={(e) => handleSimpleInputChange("fullName", e.target.value)}
          className={errors?.fullName ? "border-destructive" : ""}
        />
        {errors?.fullName && (
          <p className="text-sm text-destructive">{errors.fullName}</p>
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
            className={errors?.password ? "border-destructive pe-10" : "pe-10"}
          />
          <button
            type="button"
            className="absolute end-2 top-3 text-muted-foreground"
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

      {/* Creation-only Fields */}
      {!isEditing && (
        <>
          <div className="space-y-2">
            <Label htmlFor="userName">{t("userNameLabel")}</Label>
            <Input
              id="userName"
              placeholder={t("userNamePlaceholder")}
              value={formData.userName || ""}
              onChange={(e) =>
                handleSimpleInputChange("userName", e.target.value)
              }
              className={errors?.userName ? "border-destructive" : ""}
            />
            {errors?.userName && (
              <p className="text-sm text-destructive">{errors.userName}</p>
            )}
          </div>

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

          {/* Countries and Cities Selects */}
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
                    <SelectItem key={country.id} value={country.id}>
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
                    <SelectItem key={city.id} value={city.id}>
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
          <div className="space-y-2">
            <Label htmlFor="notes">{t("notesLabel")}</Label>
            <Textarea
              id="notes"
              placeholder={t("notesPlaceholder")}
              value={formData.notes || ""}
              onChange={(e) => handleSimpleInputChange("notes", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="canMakeOffer"
              checked={!!formData.canMakeOffer}
              onCheckedChange={(checked) =>
                onFieldChange("canMakeOffer", !!checked)
              }
            />
            <Label htmlFor="canMakeOffer" className="cursor-pointer">
              {t("canMakeOfferLabel")}
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isPhone"
              checked={!!formData.isPhone}
              onCheckedChange={(checked) => onFieldChange("isPhone", !!checked)}
            />
            <Label htmlFor="isPhone" className="cursor-pointer">
              {t("isPhoneLabel")}
            </Label>
          </div>
        </>
      )}
    </div>
  );
}

export default BranchFormFields;
