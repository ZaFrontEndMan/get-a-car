import React, { useMemo, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Percent,
  Globe,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useGetAllCarOffers,
  useCreateCarOffer,
  useEditCarOffer,
  useDeleteCarOffer,
} from "@/hooks/vendor/useVendorCarOffer";
import { useGetAllCarsOffers } from "@/hooks/vendor/useVendorCar";
import { useLanguage } from "@/contexts/LanguageContext";

interface Offer {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  descriptionEr: string | null;
  daysOfOffer: number;
  offerImage: string | null;
  totalPrice: number;
  startDate: string;
  endDate: string;
  numbersOfCars: number;
  numbersOfCarsActual: number;
  isActive: boolean;
  carId: string;
  pickUpLocationID: string | null;
}

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  daily_rate: number;
}

interface FormData {
  car_id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  discount_percentage: number;
  valid_until: string;
  status: "draft" | "published";
  offerImage?: File | null;
}

const OfferCard: React.FC<{
  offer: Offer;
  t: (key: string) => string;
  onEdit: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
  deletePending: boolean;
}> = ({ offer, t, onEdit, onDelete, deletePending }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{offer.titleEn}</h3>
            <Badge variant={offer.isActive ? "default" : "secondary"}>
              {offer.isActive ? (
                <>
                  <Globe className="me-1 h-3 w-3" />
                  {t("published")}
                </>
              ) : (
                <>
                  <FileText className="me-1 h-3 w-3" />
                  {t("draft")}
                </>
              )}
            </Badge>
          </div>
          {offer.titleAr && (
            <p className="text-sm text-gray-500 mb-2" dir="rtl">
              {offer.titleAr}
            </p>
          )}
          {(offer.descriptionEr || offer.descriptionAr) && (
            <>
              {offer.descriptionEr && (
                <p className="text-gray-600 mb-2">{offer.descriptionEr}</p>
              )}
              {offer.descriptionAr && (
                <p className="text-gray-600 mb-2 text-sm" dir="rtl">
                  {offer.descriptionAr}
                </p>
              )}
            </>
          )}
          {offer.offerImage && (
            <div className="mb-2">
              <img
                src={`${import.meta.env.VITE_UPLOADS_BASE_URL}/${
                  offer.offerImage
                }`}
                alt={offer.titleEn}
                className="h-24 w-24 object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center">
              <Percent className="mr-1 h-3 w-3" />
              {offer.totalPrice}% {t("off")}
            </span>
            <span className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              {t("validUntilDate")}{" "}
              {offer.endDate
                ? new Date(offer.endDate).toLocaleDateString()
                : "—"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm" onClick={() => onEdit(offer)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(offer.id)}
            disabled={deletePending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const OfferForm: React.FC<{
  formData: FormData;
  setFormData: (data: FormData) => void;
  selectedCarId: string;
  setSelectedCarId: (id: string) => void;
  cars: Car[];
  t: (key: string) => string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingOffer: Offer | null;
  createPending: boolean;
  editPending: boolean;
}> = ({
  formData,
  setFormData,
  selectedCarId,
  setSelectedCarId,
  cars,
  t,
  onSubmit,
  onCancel,
  editingOffer,
  createPending,
  editPending,
}) => {
  const selectedCar = cars.find((car) => car.id === selectedCarId);
  const originalPrice = selectedCar?.daily_rate || 0;
  const discountedPrice =
    originalPrice * (1 - (Number(formData.discount_percentage) || 0) / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingOffer ? t("editOffer") : t("createNewOffer")}
        </CardTitle>
        <CardDescription>{t("formDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="car_id">{t("selectCar")}</Label>
            {cars.length === 0 ? (
              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                {t("noCars")}
              </div>
            ) : (
              <Select
                value={formData.car_id}
                onValueChange={(value) => {
                  setSelectedCarId(value);
                  setFormData({ ...formData, car_id: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCarPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedCar && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                {t("pricingPreview")}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">{t("originalPrice")}:</span>
                  <span className="font-medium ml-2">
                    {t("sarPerDay")} {originalPrice}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">{t("discountedPrice")}:</span>
                  <span className="font-medium ml-2 text-green-600">
                    {t("sarPerDay")} {discountedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("titleEn")}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={t("titleEnPlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_ar">{t("titleAr")}</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) =>
                  setFormData({ ...formData, title_ar: e.target.value })
                }
                placeholder={t("titleArPlaceholder")}
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t("descriptionEn")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t("descriptionEnPlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_ar">{t("descriptionAr")}</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) =>
                  setFormData({ ...formData, description_ar: e.target.value })
                }
                placeholder={t("descriptionArPlaceholder")}
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer_image">{t("image")}</Label>
            <Input
              id="offer_image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  offerImage: e.target.files ? e.target.files[0] : null,
                })
              }
              required={!editingOffer} // Required only for new offers
            />
            {editingOffer && editingOffer.offerImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">{t("image")}</p>
                <img
                  src={`${import.meta.env.VITE_UPLOADS_BASE_URL}/${
                    editingOffer.offerImage
                  }`}
                  alt={editingOffer.titleEn}
                  className="h-32 w-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_percentage">
                {t("discountPercentage")}
              </Label>
              <Input
                id="discount_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_percentage: Number(e.target.value),
                  })
                }
                onWheel={(e) => e.target.blur()}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valid_until">{t("validUntil")}</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) =>
                  setFormData({ ...formData, valid_until: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t("status")}</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "draft" | "published") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t("draft")}</SelectItem>
                <SelectItem value="published">{t("published")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={
                createPending ||
                editPending ||
                cars.length === 0 ||
                (!editingOffer && !formData.offerImage)
              }
            >
              {editingOffer ? t("updateOffer") : t("createOffer")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const VendorOffers: React.FC = () => {
  const { t } = useLanguage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    car_id: "",
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    discount_percentage: 0,
    valid_until: "",
    status: "draft",
    offerImage: null,
  });

  const queryClient = useQueryClient();
  const createMutation = useCreateCarOffer();
  const editMutation = useEditCarOffer();
  const deleteMutation = useDeleteCarOffer();

  const {
    data: carsData,
    isLoading: carsLoading,
    error: carsError,
  } = useGetAllCarsOffers();
  const {
    data: offersData,
    isLoading: offersLoading,
    error: offersError,
  } = useGetAllCarOffers();

  const cars: Car[] = useMemo(() => {
    const d: any = carsData as any;
    const rawList =
      d?.data?.data?.vendorCars ||
      d?.data?.vendorCars ||
      d?.vendorCars ||
      d?.data ||
      d ||
      [];
    return Array.isArray(rawList)
      ? rawList.map((c: any) => ({
          id: String(c?.id ?? ""),
          name: c?.name ?? "",
          brand: c?.model ? String(c.model).split(" ")[0] : c?.brand ?? "",
          model: c?.model ?? "",
          daily_rate: c?.pricePerDay ?? c?.daily_rate ?? 0,
        }))
      : [];
  }, [carsData]);

  const offers: Offer[] = useMemo(() => {
    const d: any = offersData as any;
    const arr = d?.data || d?.offers || d?.data?.data || [];
    return Array.isArray(arr)
      ? arr.map((o: any) => ({
          id: String(o?.id ?? ""),
          carId: String(o?.carId ?? o?.carID ?? ""),
          titleEn: o?.titleEn ?? o?.title ?? "",
          titleAr: o?.titleAr ?? "",
          descriptionEr: o?.descriptionEr ?? o?.description ?? null,
          descriptionAr: o?.descriptionAr ?? null,
          daysOfOffer: o?.daysOfOffer ?? 0,
          offerImage: o?.offerImage ?? null,
          totalPrice: o?.totalPrice ?? 0,
          startDate: o?.startDate ?? "",
          endDate: o?.endDate ?? "",
          numbersOfCars: o?.numbersOfCars ?? 0,
          numbersOfCarsActual: o?.numbersOfCarsActual ?? 0,
          isActive: o?.isActive ?? false,
          pickUpLocationID: String(o?.pickUpLocationID ?? null),
        }))
      : [];
  }, [offersData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const fd = new FormData();
        fd.append("titleAr", formData.title_ar || "");
        fd.append("titleEn", formData.title || "");
        fd.append("descriptionAr", formData.description_ar || "");
        fd.append("descriptionEn", formData.description || "");
        fd.append("totalPrice", String(formData.discount_percentage || 0));
        const nowIso = new Date().toISOString();
        const toIso = formData.valid_until
          ? new Date(formData.valid_until).toISOString()
          : nowIso;
        fd.append("from", nowIso);
        fd.append("to", toIso);
        fd.append("isActive", String(formData.status === "published"));

        if (editingOffer?.id) fd.append("id", editingOffer.id);
        if (!editingOffer?.id)
          fd.append("carID", formData.car_id || selectedCarId || "");
        if (formData.offerImage) {
          fd.append("offerImage", formData.offerImage);
        }

        const mutation = editingOffer ? editMutation : createMutation;
        const successMessage = editingOffer
          ? t("offerUpdated")
          : t("offerCreated");

        mutation.mutate(fd, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["vendor", "carOffers"],
            });
            toast.success(successMessage);
            handleCloseModal();
          },
          onError: (error: any) =>
            toast.error(
              `${t(
                editingOffer ? "failedToUpdateOffer" : "failedToCreateOffer"
              )}: ${error?.message || t("unknownError")}`
            ),
        });
      } catch (error: any) {
        toast.error(
          `${t("failedToSaveOffer")}: ${error?.message || t("unknownError")}`
        );
      }
    },
    [
      formData,
      selectedCarId,
      editingOffer,
      createMutation,
      editMutation,
      queryClient,
      t,
    ]
  );

  const handleEdit = useCallback((offer: Offer) => {
    setEditingOffer(offer);
    setSelectedCarId(offer.carId);
    setFormData({
      car_id: offer.carId,
      title: offer.titleEn,
      title_ar: offer.titleAr,
      description: offer.descriptionEr || "",
      description_ar: offer.descriptionAr || "",
      discount_percentage: offer.totalPrice,
      valid_until: offer.endDate ? offer.endDate.split("T")[0] : "",
      status: offer.isActive ? "published" : "draft",
      offerImage: null, // No file initially loaded for edit
    });
    setIsCreateModalOpen(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleDelete = useCallback((offerId: string) => {
    setOfferToDelete(offerId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (offerToDelete) {
      deleteMutation.mutate(offerToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["vendor", "carOffers"],
          });
          toast.success(t("offerDeleted"));
          setIsDeleteModalOpen(false);
          setOfferToDelete(null);
        },
        onError: (error: any) =>
          toast.error(
            `${t("failedToDeleteOffer")}: ${
              error?.response?.data?.error?.message || t("unknownError")
            }`
          ),
      });
    }
  }, [deleteMutation, offerToDelete, queryClient, t]);

  const handleCloseModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setEditingOffer(null);
    setSelectedCarId("");
    setFormData({
      car_id: "",
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      discount_percentage: 0,
      valid_until: "",
      status: "draft",
      offerImage: null,
    });
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setOfferToDelete(null);
  }, []);

  if (carsLoading || offersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">{t("loading")}</span>
      </div>
    );
  }

  if (carsError || offersError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {t("errorLoading")}{" "}
          {(carsError || offersError)?.message || t("unknownError")}
        </p>
        <Button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["vendor", "cars"] })
          }
          className="mt-4"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={editingOffer !== null}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("createOffer")}
        </Button>
      </div>

      {isCreateModalOpen && (
        <OfferForm
          formData={formData}
          setFormData={setFormData}
          selectedCarId={selectedCarId}
          setSelectedCarId={setSelectedCarId}
          cars={cars}
          t={t}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          editingOffer={editingOffer}
          createPending={createMutation.isPending}
          editPending={editMutation.isPending}
        />
      )}

      <div className="grid gap-4">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            t={t}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletePending={deleteMutation.isPending}
          />
        ))}
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" text-start">
              {t("confirmDeleteOffer")}
            </DialogTitle>
            <DialogDescription className=" text-start">
              {t("deleteOfferDescription")} {t("actionCannotBeUndone")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2  justify-start w-full">
            <Button
              variant="outline"
              onClick={handleCloseDeleteModal}
              disabled={deleteMutation.isPending}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorOffers;
