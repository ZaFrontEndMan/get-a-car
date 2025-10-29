import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCarTypes,
  useGetFuelTypes,
  useGetTransmissionTypes,
  useGetCarBrands,
  useGetCarModels,
} from "@/hooks/vendor/useCarDetails";

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
  const { data: carTypes, isLoading: carTypesLoading } = useGetCarTypes();
  const { data: fuelTypes, isLoading: fuelTypesLoading } = useGetFuelTypes();
  const { data: transmissionTypes, isLoading: transmissionTypesLoading } =
    useGetTransmissionTypes();
  const { data: carBrands, isLoading: carBrandsLoading } = useGetCarBrands();
  const { data: carModels, isLoading: carModelsLoading } = useGetCarModels();

  // Filter models by selected brand's tradeMarkId
  const filteredModels =
    carModels?.filter((model) => model.tradeMarkId === formData.tradeMarkId) ||
    [];

  // Reset modelId when tradeMarkId changes if the current model is invalid
  useEffect(() => {
    if (formData.tradeMarkId && carModels && formData.modelId) {
      const isValidModel = filteredModels.some(
        (model) => model.id === formData.modelId
      );
      if (!isValidModel) {
        handleChange("modelId", "");
        handleChange("model", "");
      }
    }
  }, [formData.tradeMarkId, carModels, filteredModels, handleChange]);

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
          <Label htmlFor="tradeMarkId">{t("brand")} *</Label>
          <Select
            value={formData.tradeMarkId?.toString() || ""}
            onValueChange={(value) => {
              const selectedBrand = carBrands?.find(
                (brand) => brand.id.toString() === value
              );
              handleChange("tradeMarkId", value ? parseInt(value) : "");
              handleChange("brand", selectedBrand?.name || "");
            }}
            disabled={carBrandsLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  carBrandsLoading ? t("loading") : t("select_brand")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {carBrands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {t(brand.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="modelId">{t("model")} *</Label>
          <Select
            value={formData.modelId?.toString() || ""}
            onValueChange={(value) => {
              const selectedModel = filteredModels?.find(
                (model) => model.id.toString() === value
              );
              handleChange("modelId", value ? parseInt(value) : "");
              handleChange("model", selectedModel?.name || "");
            }}
            disabled={carModelsLoading || !formData.tradeMarkId}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  carModelsLoading
                    ? t("loading")
                    : !formData.tradeMarkId
                    ? t("select_brand_first")
                    : t("select_model")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredModels?.map((model) => (
                <SelectItem key={model.id} value={model.id.toString()}>
                  {t(model.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            value={formData.type?.toString() || ""}
            onValueChange={(value) => {
              const selectedType = carTypes?.find(
                (type) => type.id.toString() === value
              );
              handleChange("type", value ? parseInt(value) : "");
              handleChange("typeName", selectedType?.name || "");
            }}
            disabled={carTypesLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  carTypesLoading ? t("loading") : t("select_car_type")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {carTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {t(type.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fuel_type">{t("fuel_type")} *</Label>
          <Select
            value={formData.fuel_type?.toString() || ""}
            onValueChange={(value) => {
              const selectedFuel = fuelTypes?.find(
                (fuel) => fuel.id.toString() === value
              );
              handleChange("fuel_type", value ? parseInt(value) : "");
              handleChange("fuelTypeName", selectedFuel?.name || "");
            }}
            disabled={fuelTypesLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  fuelTypesLoading ? t("loading") : t("select_fuel_type")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes?.map((fuel) => (
                <SelectItem key={fuel.id} value={fuel.id.toString()}>
                  {t(fuel.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="transmission">{t("transmission")} *</Label>
          <Select
            value={formData.transmission?.toString() || ""}
            onValueChange={(value) => {
              const selectedTrans = transmissionTypes?.find(
                (trans) => trans.id.toString() === value
              );
              handleChange("transmission", value ? parseInt(value) : "");
              handleChange("transmissionName", selectedTrans?.name || "");
            }}
            disabled={transmissionTypesLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  transmissionTypesLoading
                    ? t("loading")
                    : t("select_transmission")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {transmissionTypes?.map((trans) => (
                <SelectItem key={trans.id} value={trans.id.toString()}>
                  {t(trans.name)}
                </SelectItem>
              ))}
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
