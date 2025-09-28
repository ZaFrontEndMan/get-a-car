import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BranchFormFieldsProps {
  formData: any;
  errors?: any;
  onFieldChange: (field: string, value: any) => void;
  t: (key: string) => string;
}

export function BranchFormFields({
  formData,
  errors,
  onFieldChange,
  t,
}: BranchFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nickName">{t("branchNameLabel")}</Label>
        <Input
          id="nickName"
          placeholder={t("branchNamePlaceholder")}
          value={formData.nickName}
          onChange={(e) => onFieldChange("nickName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t("addressLabel")}</Label>
        <Input
          id="address"
          placeholder={t("addressPlaceholder")}
          value={formData.address}
          onChange={(e) => onFieldChange("address", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="managerName">{t("managerNameLabel")}</Label>
        <Input
          id="managerName"
          placeholder={t("managerNamePlaceholder")}
          value={formData.managerName}
          onChange={(e) => onFieldChange("managerName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">{t("fullNameLabel")}</Label>
        <Input
          id="fullName"
          placeholder={t("fullName")}
          value={formData.fullName}
          onChange={(e) => onFieldChange("fullName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t("enterPassword")}
          value={formData.password}
          onChange={(e) => onFieldChange("password", e.target.value)}
          className={errors?.password ? "border-destructive" : ""}
        />
        {errors?.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>
    </div>
  );
}

export default BranchFormFields;
