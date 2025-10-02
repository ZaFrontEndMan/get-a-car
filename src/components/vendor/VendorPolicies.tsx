import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, Shield, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVendorPolicies } from "@/hooks/vendor/useVendorPolicies";

interface VendorPolicy {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  policyType: number;
  displayOrder: number;
  isActive: boolean;
  vendorId: string;
  vendorBranchId: string | null;
}

const VendorPolicies = () => {
  const { t } = useLanguage();
  const {
    policies,
    isLoading,
    createPolicy,
    updatePolicy,
    deletePolicy,
    isCreating,
    isUpdating,
    isDeleting,
  } = useVendorPolicies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<VendorPolicy | null>(null);
  const [deletingPolicyId, setDeletingPolicyId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titleEn: "",
    titleAr: "",
    descriptionEn: "",
    descriptionAr: "",
    policyType: 0,
    displayOrder: 0,
    isActive: true,
  });

  const handleEdit = (policy: VendorPolicy) => {
    setEditingPolicy(policy);
    setFormData({
      titleEn: policy.titleEn,
      titleAr: policy.titleAr,
      descriptionEn: policy.descriptionEn,
      descriptionAr: policy.descriptionAr,
      policyType: policy.policyType,
      displayOrder: policy.displayOrder,
      isActive: policy.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.descriptionEn) {
      toast.error(t("errors_required_english_fields"));
      return;
    }
    // Optionally, require Arabic fields
    if (!formData.titleAr || !formData.descriptionAr) {
      toast.error(t("errors_required_arabic_fields"));
      return;
    }

    const body = {
      titleEn: formData.titleEn,
      titleAr: formData.titleAr,
      descriptionEn: formData.descriptionEn,
      descriptionAr: formData.descriptionAr,
      policyType: formData.policyType,
      displayOrder: formData.displayOrder,
      isActive: formData.isActive,
    };

    if (editingPolicy) {
      updatePolicy({ policyId: editingPolicy.id, body });
    } else {
      createPolicy(body);
    }

    resetForm();
  };

  const handleDelete = (policyId: string) => {
    setDeletingPolicyId(policyId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingPolicyId) {
      deletePolicy(deletingPolicyId);
      setIsDeleteDialogOpen(false);
      setDeletingPolicyId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      policyType: 0,
      displayOrder: 0,
      isActive: true,
    });
    setEditingPolicy(null);
    setIsDialogOpen(false);
  };

  const policyTypes = [
    { value: "0", label: t("policy_types_general") },
    { value: "1", label: t("policy_types_booking") },
    { value: "2", label: t("policy_types_cancellation") },
    { value: "3", label: t("policy_types_payment") },
    { value: "4", label: t("policy_types_insurance") },
    { value: "5", label: t("policy_types_fuel") },
    { value: "6", label: t("policy_types_damage") },
    // Allow custom policy types
    { value: "custom", label: t("policy_types_custom") },
  ];

  const getPolicyTypeLabel = (policyType: number) => {
    const type = policyTypes.find((t) => parseInt(t.value) === policyType);
    return type ? type.label : `${t("policy_types_custom")} (${policyType})`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("rental_policies_title")}</h2>
          <p className="text-gray-600">{t("rental_policies_description")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingPolicy(null)}
              disabled={isCreating}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("actions_add_policy")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-start">
                {editingPolicy
                  ? t("actions_edit_policy")
                  : t("actions_add_new_policy")}
              </DialogTitle>
              <DialogDescription className="text-start">
                {t("rental_policies_form_description")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form_title_en")}
                  </label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) =>
                      setFormData({ ...formData, titleEn: e.target.value })
                    }
                    placeholder={t("form_placeholder_title_en")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form_title_ar")}
                  </label>
                  <Input
                    value={formData.titleAr}
                    onChange={(e) =>
                      setFormData({ ...formData, titleAr: e.target.value })
                    }
                    placeholder={t("form_placeholder_title_ar")}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form_policy_type")}
                  </label>
                  <Select
                    value={
                      policyTypes.some(
                        (type) => type.value === formData.policyType.toString()
                      )
                        ? formData.policyType.toString()
                        : "custom"
                    }
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        policyType:
                          value === "custom" ? 0 : parseInt(value) || 0,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {policyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form_display_order")}
                  </label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form_description_en")}
                  </label>
                  <Textarea
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionEn: e.target.value,
                      })
                    }
                    placeholder={t("form_placeholder_description_en")}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("form_description_ar")}
                  </label>
                  <Textarea
                    value={formData.descriptionAr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionAr: e.target.value,
                      })
                    }
                    placeholder={t("form_placeholder_description_ar")}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    {t("form_is_active")}
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isCreating || isUpdating}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t("actions_cancel")}
                  </Button>
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    <Save className="mr-2 h-4 w-4" />
                    {t("actions_save")}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>{t("current_policies_title")}</span>
          </CardTitle>
          <CardDescription>{t("current_policies_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonLoader />
          ) : policies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>{t("current_policies_no_policies")}</p>
              <p className="text-sm">{t("current_policies_start_adding")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">
                    {t("table_title_en")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("table_title_ar")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("table_type")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("table_status")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("table_order")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("table_actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{policy.titleEn}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {policy.descriptionEn}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{policy.titleAr}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {policy.descriptionAr}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPolicyTypeLabel(policy.policyType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={policy.isActive ? "default" : "secondary"}
                      >
                        {policy.isActive
                          ? t("status_active")
                          : t("status_inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell>{policy.displayOrder}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(policy)}
                          disabled={isDeleting}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(policy.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">
              {t("modal_delete_title")}
            </DialogTitle>
            <DialogDescription className="text-start">
              {t("modal_delete_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-start gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t("actions_cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("modal_deleting") : t("modal_confirm_delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SkeletonLoader = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px] text-start" />
        <TableHead className="w-[100px] text-start" />
        <TableHead className="w-[100px] text-start" />
        <TableHead className="w-[100px] text-start" />
        <TableHead className="w-[100px] text-start" />
        <TableHead className="w-[100px] text-start" />
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
);

export default VendorPolicies;
