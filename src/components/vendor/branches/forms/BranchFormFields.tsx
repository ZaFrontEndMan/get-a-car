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
import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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

  // Countries and cities queries - use string values directly from formData
  const countryValue = formData.country ? String(formData.country) : "";
  const cityValue = formData.city ? String(formData.city) : "";
  
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: cities, isLoading: citiesLoading } = useCitiesByCountry(
    countryValue || null
  );

  const handleCountryChange = (value: string) => {
    // Convert string to number for parent
    const numericValue = value ? parseInt(value) : null;
    onFieldChange("country", numericValue);
    // Reset city when country changes
    onFieldChange("city", null);
  };

  const handleCityChange = (value: string) => {
    // Convert string to number for parent
    const numericValue = value ? parseInt(value) : null;
    onFieldChange("city", numericValue);
  };

  const handleSimpleInputChange = (field: string, value: string) => {
    onFieldChange(field, value);
  };

  return (
    <div className="space-y-4">
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
        <Input
          id="password"
          type="password"
          placeholder={t("enterPassword")}
          value={formData.password || ""}
          onChange={(e) => handleSimpleInputChange("password", e.target.value)}
          className={errors?.password ? "border-destructive" : ""}
        />
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

          {/* Countries and Cities Selects */}
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
                      !countryValue
                        ? t("selectCountryFirst")
                        : t("selectCity")
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

          <div className="flex items-center space-x-2">
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPhone"
              checked={!!formData.isPhone}
              onCheckedChange={(checked) =>
                onFieldChange("isPhone", !!checked)
              }
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
