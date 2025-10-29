import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetServiceTypes } from "@/hooks/vendor/useCarDetails";

interface PaidFeature {
  id?: number;
  title: string;
  titleAr?: string;
  titleEn?: string;
  price: number;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  serviceTypeId?: number;
}

interface PaidFeaturesSectionProps {
  paidFeatures: PaidFeature[];
  setPaidFeatures: React.Dispatch<React.SetStateAction<PaidFeature[]>>;
  t: (key: string, params?: Record<string, any>) => string;
}

const PaidFeaturesSection = ({
  paidFeatures,
  setPaidFeatures,
  t,
}: PaidFeaturesSectionProps) => {
  const { data: serviceTypes, isLoading: serviceTypesLoading } =
    useGetServiceTypes();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addPaidFeature = () => {
    setPaidFeatures([
      ...paidFeatures,
      {
        title: "",
        titleAr: "",
        titleEn: "",
        price: 0,
        description: "",
        descriptionAr: "",
        descriptionEn: "",
        serviceTypeId: undefined,
      },
    ]);
    setExpandedIndex(paidFeatures.length);
  };

  const removePaidFeature = (index: number) => {
    setPaidFeatures(paidFeatures.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const updatePaidFeature = (
    index: number,
    field: keyof PaidFeature,
    value: any
  ) => {
    const updated = paidFeatures.map((feature, i) =>
      i === index ? { ...feature, [field]: value } : feature
    );
    setPaidFeatures(updated);
  };

  return (
    <Card dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {t("additional_paid_features")}
          </CardTitle>
          <Button type="button" onClick={addPaidFeature} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t("add_feature")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {paidFeatures.map((feature, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-3 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {t("feature")} #{index + 1}
              </h4>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  {expandedIndex === index ? t("collapse") : t("expand")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePaidFeature(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>{t("service_type")} *</Label>
                <Select
                  value={feature.serviceTypeId?.toString() || ""}
                  onValueChange={(value) =>
                    updatePaidFeature(index, "serviceTypeId", parseInt(value))
                  }
                  disabled={serviceTypesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        serviceTypesLoading
                          ? t("loading")
                          : t("select_service_type")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes?.map((type: any) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t("price_sar")} *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={feature.price}
                  onChange={(e) =>
                    updatePaidFeature(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            {expandedIndex === index ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>{t("title_english")} *</Label>
                    <Input
                      value={feature.titleEn || ""}
                      onChange={(e) =>
                        updatePaidFeature(index, "titleEn", e.target.value)
                      }
                      placeholder={t("enter_title_english")}
                    />
                  </div>

                  <div>
                    <Label>{t("title_arabic")}</Label>
                    <Input
                      value={feature.titleAr || ""}
                      onChange={(e) =>
                        updatePaidFeature(index, "titleAr", e.target.value)
                      }
                      placeholder={t("enter_title_arabic")}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>{t("description_english")}</Label>
                    <Textarea
                      value={feature.descriptionEn || ""}
                      onChange={(e) =>
                        updatePaidFeature(
                          index,
                          "descriptionEn",
                          e.target.value
                        )
                      }
                      placeholder={t("enter_description_english")}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>{t("description_arabic")}</Label>
                    <Textarea
                      value={feature.descriptionAr || ""}
                      onChange={(e) =>
                        updatePaidFeature(
                          index,
                          "descriptionAr",
                          e.target.value
                        )
                      }
                      placeholder={t("enter_description_arabic")}
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-600">
                <p>
                  <strong>{t("english")}:</strong>{" "}
                  {feature.titleEn || t("not_set")}
                </p>
                <p>
                  <strong>{t("arabic")}:</strong>{" "}
                  {feature.titleAr || t("not_set")}
                </p>
              </div>
            )}
          </div>
        ))}

        {paidFeatures.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t("no_paid_features_added")}</p>
            <p className="text-sm">{t("click_add_to_create_feature")}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PaidFeaturesSection;
