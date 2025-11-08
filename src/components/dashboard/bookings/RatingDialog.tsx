import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star } from "lucide-react";

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fields: {
    ratingVendor: number;
    ratingBooking: number;
    ratingWebsite: number;
    ratingCar: number;
    comment: string;
    bookingId: string | number;
  }) => void;
  bookingId: string | number;
}

const STAR_COUNT = 5;

function StarRow({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = useState<number>(0);

  return (
    <div>
      <label htmlFor={id} className="block mb-1 font-medium">
        {label}
      </label>
      <div id={id} className="flex gap-1" onMouseLeave={() => setHovered(0)}>
        {Array.from({ length: STAR_COUNT }, (_, i) => {
          const starValue = i + 1;
          return (
            <button
              key={starValue}
              type="button"
              className="focus:outline-none"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHovered(starValue)}
              tabIndex={0}
              aria-label={label + " " + starValue}
            >
              <Star
                className={
                  (hovered ? starValue <= hovered : starValue <= value)
                    ? "w-7 h-7 text-yellow-500 fill-yellow-400"
                    : "w-7 h-7 text-gray-300"
                }
                fill={
                  (hovered ? starValue <= hovered : starValue <= value)
                    ? "currentColor"
                    : "none"
                }
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  onSubmit,
  bookingId,
}) => {
  const { t } = useLanguage();

  const [fields, setFields] = useState({
    ratingVendor: 0,
    ratingBooking: 0,
    ratingWebsite: 0,
    ratingCar: 0,
    comment: "",
  });

  const handleField = (name: keyof typeof fields, value: number | string) => {
    setFields((old) => ({
      ...old,
      [name]: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    handleField(name as keyof typeof fields, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...fields, bookingId });
    onClose();
    setFields({
      ratingVendor: 0,
      ratingBooking: 0,
      ratingWebsite: 0,
      ratingCar: 0,
      comment: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("rateBooking")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <StarRow
            id="ratingVendor"
            label={t("rateVendor")}
            value={fields.ratingVendor}
            onChange={(v) => handleField("ratingVendor", v)}
          />
          <StarRow
            id="ratingBooking"
            label={t("rateBookingProcess")}
            value={fields.ratingBooking}
            onChange={(v) => handleField("ratingBooking", v)}
          />
          <StarRow
            id="ratingWebsite"
            label={t("rateWebsite")}
            value={fields.ratingWebsite}
            onChange={(v) => handleField("ratingWebsite", v)}
          />
          <StarRow
            id="ratingCar"
            label={t("rateCar")}
            value={fields.ratingCar}
            onChange={(v) => handleField("ratingCar", v)}
          />
          <div>
            <label htmlFor="ratingComment" className="block mb-1 font-medium">
              {t("commentPlaceholder")}
            </label>
            <textarea
              id="ratingComment"
              name="comment"
              placeholder={t("commentPlaceholder")}
              value={fields.comment}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="outline">
              {t("cancel")}
            </Button>
            <Button type="submit">{t("submitRating")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
