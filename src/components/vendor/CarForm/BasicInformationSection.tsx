import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInformationSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const BasicInformationSection = ({
  formData,
  handleChange,
  t,
}: BasicInformationSectionProps) => {
  return (
    <div dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg font-semibold mb-4">{t("basic_information")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t("car_name")} *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="brand">{t("brand")} *</Label>
          <Input
            id="brand"
            value={formData.brand || ""}
            onChange={(e) => handleChange("brand", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="model">{t("model")} *</Label>
          <Input
            id="model"
            value={formData.model || ""}
            onChange={(e) => handleChange("model", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="year">{t("year")} *</Label>
          <Input
            id="year"
            type="number"
            value={formData.year || ""}
            onChange={(e) => handleChange("year", parseInt(e.target.value))}
            min="2000"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">{t("type")} *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_car_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">{t("sedan")}</SelectItem>
              <SelectItem value="suv">{t("suv")}</SelectItem>
              <SelectItem value="hatchback">{t("hatchback")}</SelectItem>
              <SelectItem value="coupe">{t("coupe")}</SelectItem>
              <SelectItem value="convertible">{t("convertible")}</SelectItem>
              <SelectItem value="wagon">{t("wagon")}</SelectItem>
              <SelectItem value="pickup">{t("pickup")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fuel_type">{t("fuel_type")} *</Label>
          <Select
            value={formData.fuel_type}
            onValueChange={(value) => handleChange("fuel_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_fuel_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">{t("petrol")}</SelectItem>
              <SelectItem value="diesel">{t("diesel")}</SelectItem>
              <SelectItem value="electric">{t("electric")}</SelectItem>
              <SelectItem value="hybrid">{t("hybrid")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="transmission">{t("transmission")} *</Label>
          <Select
            value={formData.transmission}
            onValueChange={(value) => handleChange("transmission", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_transmission")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">{t("manual")}</SelectItem>
              <SelectItem value="automatic">{t("automatic")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="seats">{t("seats")} *</Label>
          <Input
            id="seats"
            type="number"
            value={formData.seats || ""}
            onChange={(e) => handleChange("seats", parseInt(e.target.value))}
            min="2"
            max="8"
            required
          />
        </div>

        <div>
          <Label htmlFor="color">{t("color")}</Label>
          <Input
            id="color"
            value={formData.color || ""}
            onChange={(e) => handleChange("color", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="license_plate">{t("license_plate")}</Label>
          <Input
            id="license_plate"
            value={formData.license_plate || ""}
            onChange={(e) => handleChange("license_plate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
