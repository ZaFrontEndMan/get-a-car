import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Shield } from "lucide-react";

interface Protection {
  id?: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

interface ProtectionsSectionProps {
  protections: Protection[];
  setProtections: React.Dispatch<React.SetStateAction<Protection[]>>;
  t: (key: string, params?: Record<string, any>) => string;
}

const ProtectionsSection = ({
  protections,
  setProtections,
  t,
}: ProtectionsSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addProtection = () => {
    setProtections([
      ...protections,
      {
        nameAr: "",
        nameEn: "",
        descriptionAr: "",
        descriptionEn: "",
      },
    ]);
    setExpandedIndex(protections.length);
  };

  const removeProtection = (index: number) => {
    setProtections(protections.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const updateProtection = (
    index: number,
    field: keyof Protection,
    value: string
  ) => {
    const updated = protections.map((prot, i) =>
      i === index ? { ...prot, [field]: value } : prot
    );
    setProtections(updated);
  };

  return (
    <Card dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("protections")}
          </CardTitle>
          <Button type="button" onClick={addProtection} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t("add_protection")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {protections.map((protection, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-3 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {t("protection")} #{index + 1}
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
                  onClick={() => removeProtection(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {expandedIndex === index ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>{t("name_english")} *</Label>
                    <Input
                      value={protection.nameEn}
                      onChange={(e) =>
                        updateProtection(index, "nameEn", e.target.value)
                      }
                      placeholder={t("enter_name_english")}
                    />
                  </div>

                  <div>
                    <Label>{t("name_arabic")} *</Label>
                    <Input
                      value={protection.nameAr}
                      onChange={(e) =>
                        updateProtection(index, "nameAr", e.target.value)
                      }
                      placeholder={t("enter_name_arabic")}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>{t("description_english")}</Label>
                    <Textarea
                      value={protection.descriptionEn}
                      onChange={(e) =>
                        updateProtection(index, "descriptionEn", e.target.value)
                      }
                      placeholder={t("enter_description_english")}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>{t("description_arabic")}</Label>
                    <Textarea
                      value={protection.descriptionAr}
                      onChange={(e) =>
                        updateProtection(index, "descriptionAr", e.target.value)
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
                  {protection.nameEn || t("not_set")}
                </p>
                <p>
                  <strong>{t("arabic")}:</strong>{" "}
                  {protection.nameAr || t("not_set")}
                </p>
              </div>
            )}
          </div>
        ))}

        {protections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t("no_protections_added")}</p>
            <p className="text-sm">{t("click_add_to_create_protection")}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ProtectionsSection;
