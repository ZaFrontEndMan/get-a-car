import { useState, useEffect } from "react";
import { getDefaultFormData, CarFormData } from "./types";

export const useCarForm = (car?: any, _onSuccess?: () => void) => {
  const [formData, setFormData] = useState<CarFormData>(getDefaultFormData());

  useEffect(() => {
    if (car) {
      // Map API response to form data
      setFormData({
        id: car.id || "",
        name: car.name || "",
        brand: car.tradeMark || car.brand || "",
        tradeMarkId: car.tradeMarkId || "",
        model: car.model || "",
        modelId: car.modelId || "",
        year: car.year || new Date().getFullYear(),
        type: car.type || "",
        carTypeId: car.carTypeId || "",
        fuel_type: car.fuelType || car.fuel_type || "",
        fuelTypeId: car.fuelTypeId || "",
        transmission: car.transmission || "",
        transmissionTypeId: car.transmissionTypeId || "",
        seats: parseInt(car.doors || car.seats) || 4,
        color: car.color || "",
        license_plate: car.license_plate || "",
        daily_rate: car.pricePerDay || car.daily_rate || 0,
        weekly_rate: car.pricePerWeek || car.weekly_rate || 0,
        monthly_rate: car.pricePerMonth || car.monthly_rate || 0,
        deposit_amount: car.deposit_amount || 0,
        images: car.images?.map((img: any) => img.imageUrl || img) || [],
        features: extractFeatures(car),
        is_available: car.availabilityVendor ?? car.is_available ?? true,
        branch_id: car.branchId || car.branch_id || "",
        mileage_limit: parseInt(car.mileage) || car.mileage_limit || 0,
        cancellation_policies: car.cancellation_policies || "",
        description: car.description || "",
        liter: car.liter || "",
        withDriver: car.withDriver || false,
        protectionPrice: car.protectionPrice || 0,
      });
    } else {
      setFormData(getDefaultFormData());
    }
  }, [car]);

  const handleChange = (field: keyof CarFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};

// Helper function to extract features from API response
const extractFeatures = (car: any): string[] => {
  const features: string[] = [];

  if (car.electricMirrors) features.push("electricMirrors");
  if (car.cruiseControl) features.push("cruiseControl");
  if (car.fogLights) features.push("fogLights");
  if (car.power) features.push("power");
  if (car.roofBox) features.push("roofBox");
  if (car.gps) features.push("gps");
  if (car.remoteControl) features.push("remoteControl");
  if (car.audioInput) features.push("audioInput");
  if (car.cdPlayer) features.push("cdPlayer");
  if (car.bluetooth) features.push("bluetooth");
  if (car.usbInput) features.push("usbInput");
  if (car.sensors) features.push("sensors");
  if (car.ebdBrakes) features.push("ebdBrakes");
  if (car.airbag) features.push("airbag");
  if (car.absBrakes) features.push("absBrakes");

  return features;
};
