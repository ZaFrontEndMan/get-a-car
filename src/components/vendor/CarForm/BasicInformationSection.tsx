import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

  const [isDropdownsReady, setIsDropdownsReady] = useState(false);

  // Filter models by selected brand's tradeMarkId
  const filteredModels =
    carModels?.filter((model) => model.tradeMarkId === formData.tradeMarkId) ||
    [];

  // Wait for all dropdown data to load before assigning initial form values on edit
  useEffect(() => {
    const allLoaded =
      !carTypesLoading &&
      !fuelTypesLoading &&
      !transmissionTypesLoading &&
      !carBrandsLoading &&
      !carModelsLoading;

    if (allLoaded) {
      setIsDropdownsReady(true);
    }
  }, [
    carTypesLoading,
    fuelTypesLoading,
    transmissionTypesLoading,
    carBrandsLoading,
    carModelsLoading,
  ]);

  // Reset modelId when tradeMarkId changes if model is invalid
  useEffect(() => {
    if (isDropdownsReady && formData.tradeMarkId && formData.modelId) {
      const isValidModel = filteredModels.some(
        (model) => model.id === formData.modelId
      );
      if (!isValidModel) {
        handleChange("modelId", "");
        handleChange("model", "");
      }
    }
  }, [
    formData.tradeMarkId,
    filteredModels,
    formData.modelId,
    handleChange,
    isDropdownsReady,
  ]);

  if (!isDropdownsReady) {
    return (
      <p className="text-center p-4 text-gray-500">{t("loading_dropdowns")}</p>
    );
  }

  return (
    <div dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg font-semibold mb-4">{t("basic_information")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block mb-2" htmlFor="tradeMarkId">
            {t("brand")} *
          </Label>
          <Select
            value={formData.tradeMarkId?.toString() || ""}
            onValueChange={(value) => {
              const selectedBrand = carBrands?.find(
                (brand) => brand.id.toString() === value
              );
              handleChange("tradeMarkId", value ? parseInt(value) : "");
              handleChange("tradeMark", selectedBrand?.name || "");
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
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block mb-2" htmlFor="modelId">
            {t("model")} *
          </Label>
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
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block mb-2" htmlFor="year">
            {t("year")} *
          </Label>
          <Input
            id="year"
            type="number"
            value={formData.year || ""}
            onChange={(e) => handleChange("year", parseInt(e.target.value))}
            min={2000}
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        <div>
          <Label className="block mb-2" htmlFor="typeId">
            {t("type")} *
          </Label>
          <Select
            value={formData.typeId?.toString() || ""}
            onValueChange={(value) => {
              const selectedType = carTypes?.find(
                (type) => type.id.toString() === value
              );
              handleChange("typeId", value ? parseInt(value) : "");
              handleChange("type", selectedType?.name || "");
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
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block mb-2" htmlFor="fuelTypeId">
            {t("fuel_type")} *
          </Label>
          <Select
            value={formData.fuelTypeId?.toString() || ""}
            onValueChange={(value) => {
              const selectedFuel = fuelTypes?.find(
                (fuel) => fuel.id.toString() === value
              );
              handleChange("fuelTypeId", value ? parseInt(value) : "");
              handleChange("fuelType", selectedFuel?.name || "");
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
                  {fuel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block mb-2" htmlFor="transmissionId">
            {t("transmission")} *
          </Label>
          <Select
            value={formData.transmissionId?.toString() || ""}
            onValueChange={(value) => {
              const selectedTrans = transmissionTypes?.find(
                (trans) => trans.id.toString() === value
              );
              handleChange("transmissionId", value ? parseInt(value) : "");
              handleChange("transmission", selectedTrans?.name || "");
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
                  {trans.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block mb-2" htmlFor="doors">
            {t("doors")} *
          </Label>
          <Input
            id="doors"
            type="number"
            min={2}
            max={8}
            value={formData.doors || ""}
            onChange={(e) => handleChange("doors", e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="block mb-2" htmlFor="licenseNumber">
            {t("license_plate")} *
          </Label>
          <Input
            id="licenseNumber"
            type="number"
            value={formData.licenseNumber || ""}
            onChange={(e) => handleChange("licenseNumber", e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="block mb-2" htmlFor="mileage">
            {t("mileage")} *
          </Label>
          <Input
            id="mileage"
            type="number"
            min={0}
            step="0.1"
            value={formData.mileage || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                handleChange("mileage", value);
              }
            }}
            placeholder={t("enter_mileage")}
            required
          />
        </div>

        <div>
          <Label className="block mb-2" htmlFor="liter">
            {t("liter")} *
          </Label>
          <Input
            id="liter"
            type="number"
            min={0}
            step="0.1"
            value={formData.liter || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                handleChange("liter", value);
              }
            }}
            placeholder={t("enter_liter")}
            required
          />
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="withDriver"
            checked={formData.withDriver || false}
            onCheckedChange={(checked) => handleChange("withDriver", checked)}
          />
          <Label htmlFor="withDriver" className="cursor-pointer">
            {t("with_driver")}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
