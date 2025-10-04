import React from "react";
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

interface OtherDetailsSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  branches?: Array<{ id: string; name: string }>;
  branchesLoading?: boolean;
  t: (key: string, params?: Record<string, any>) => string;
}

const OtherDetailsSection = ({
  formData,
  handleChange,
  branches,
  branchesLoading,
  t,
}: OtherDetailsSectionProps) => {
  return (
    <div dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg font-semibold mb-4">{t("other_details")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mileage_limit">{t("daily_mileage_limit")}</Label>
          <Input
            id="mileage_limit"
            type="number"
            value={formData.mileage_limit || ""}
            onChange={(e) =>
              handleChange("mileage_limit", parseInt(e.target.value))
            }
          />
        </div>

        <div>
          <Label htmlFor="branch_id">{t("branch")}</Label>
          <Select
            value={formData.branch_id || "no-branch"}
            onValueChange={(value) =>
              handleChange("branch_id", value === "no-branch" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  branchesLoading
                    ? t("loading_branches")
                    : !branches || branches.length === 0
                    ? t("no_branches_available")
                    : t("select_branch")
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-branch">{t("no_branch")}</SelectItem>
              {branches?.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Switch
            id="is_available"
            checked={formData.is_available}
            onCheckedChange={(checked) => handleChange("is_available", checked)}
          />
          <Label htmlFor="is_available">{t("available")}</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => handleChange("is_featured", checked)}
          />
          <Label htmlFor="is_featured">{t("featured")}</Label>
        </div>
      </div>
    </div>
  );
};

export default OtherDetailsSection;
