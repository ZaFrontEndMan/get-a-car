import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface CarsImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const CarsImportModal = ({
  isOpen,
  onClose,
  onImportSuccess,
  t,
}: CarsImportModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    // Create CSV template with all car fields
    const headers = [
      "name",
      "brand",
      "model",
      "year",
      "type",
      "fuel_type",
      "transmission",
      "seats",
      "color",
      "license_plate",
      "daily_rate",
      "weekly_rate",
      "monthly_rate",
      "deposit_amount",
      "mileage_limit",
      "condition",
      "features",
      "images",
      "is_available",
      "is_featured",
    ];

    const sampleData = [
      t("sample_car_name", { year: new Date().getFullYear() }), // e.g., "Toyota Camry 2024"
      "Toyota",
      "Camry",
      new Date().getFullYear().toString(),
      t("sedan"),
      t("hybrid"),
      t("automatic"),
      "5",
      t("white"),
      "ABC-123",
      "150.00",
      "900.00",
      "3500.00",
      "500.00",
      "300",
      t("excellent"),
      [t("gps_navigation"), t("bluetooth"), t("air_conditioning")].join("|"),
      "https://example.com/image1.jpg|https://example.com/image2.jpg",
      "true",
      "false",
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cars_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: t("template_downloaded"),
      description: t("template_downloaded_description"),
    });
  };

  const parseCSV = async (text: string) => {
    // Get current user and vendor info
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error(t("user_not_authenticated"));
    }

    // Get vendor for current user
    const { data: vendorData, error: vendorError } = await supabase
      .from("vendors")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (vendorError) {
      console.error("Vendor lookup error:", vendorError);
      throw new Error(t("vendor_not_found"));
    }

    const lines = text.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim());
    const data = [];

    // Map translated values to keys for validation
    const typeKeyMap = {
      [t("sedan")]: "sedan",
      [t("suv")]: "suv",
      [t("hatchback")]: "hatchback",
      [t("coupe")]: "coupe",
      [t("convertible")]: "convertible",
      [t("truck")]: "truck",
      [t("van")]: "van",
    };
    const fuelTypeKeyMap = {
      [t("petrol")]: "petrol",
      [t("diesel")]: "diesel",
      [t("electric")]: "electric",
      [t("hybrid")]: "hybrid",
    };
    const transmissionKeyMap = {
      [t("automatic")]: "automatic",
      [t("manual")]: "manual",
    };
    const conditionKeyMap = {
      [t("excellent")]: "excellent",
      [t("good")]: "good",
      [t("fair")]: "fair",
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const row: any = {};

      headers.forEach((header, index) => {
        const value = values[index]?.trim() || "";

        switch (header) {
          case "year":
          case "seats":
          case "mileage_limit":
            row[header] = value ? parseInt(value) : null;
            break;
          case "daily_rate":
          case "weekly_rate":
          case "monthly_rate":
          case "deposit_amount":
            row[header] = value ? parseFloat(value) : null;
            break;
          case "is_available":
          case "is_featured":
            row[header] = value.toLowerCase() === "true";
            break;
          case "features":
          case "images":
            row[header] = value
              ? value
                  .split("|")
                  .map((item) => item.trim())
                  .filter((item) => item)
              : [];
            break;
          case "type":
            row[header] = typeKeyMap[value] || "sedan";
            break;
          case "fuel_type":
            row[header] = fuelTypeKeyMap[value] || "petrol";
            break;
          case "transmission":
            row[header] = transmissionKeyMap[value] || "automatic";
            break;
          case "condition":
            row[header] = conditionKeyMap[value] || "excellent";
            break;
          default:
            row[header] = value || null;
        }
      });

      // Set required fields
      row.vendor_id = vendorData.id;
      row.branch_id = null; // Set to null since we don't have branch info in template

      // Ensure required fields are present
      if (
        row.name &&
        row.brand &&
        row.model &&
        row.year &&
        row.type &&
        row.fuel_type &&
        row.transmission &&
        row.seats &&
        row.daily_rate
      ) {
        data.push(row);
      }
    }

    return data;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith(".csv")) {
      toast({
        title: t("invalid_file_type"),
        description: t("invalid_file_type_description"),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(t("reading_file"));

    try {
      const text = await file.text();
      const carsData = await parseCSV(text);

      if (carsData.length === 0) {
        toast({
          title: t("no_data_found"),
          description: t("no_data_found_description"),
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      setUploadProgress(t("processing_cars", { count: carsData.length }));

      // Insert cars in batches
      const batchSize = 5;
      let imported = 0;

      for (let i = 0; i < carsData.length; i += batchSize) {
        const batch = carsData.slice(i, i + batchSize);

        console.log("Inserting batch:", batch);

        const { data, error } = await supabase
          .from("cars")
          .insert(batch)
          .select();

        if (error) {
          console.error("Batch import error:", error);
          toast({
            title: t("import_error"),
            description: t("import_error_description", {
              batchNumber: Math.floor(i / batchSize) + 1,
              errorMessage: error.message,
            }),
            variant: "destructive",
          });
          continue;
        }

        imported += data?.length || 0;
        setUploadProgress(
          t("imported_cars", { imported: imported, total: carsData.length })
        );
      }

      toast({
        title: t("import_successful"),
        description: t("import_successful_description", {
          importedCount: imported,
        }),
      });

      onImportSuccess();
      onClose();
    } catch (error) {
      console.error("File processing error:", error);
      toast({
        title: t("import_error"),
        description:
          error instanceof Error
            ? t(error.message)
            : t("file_processing_failed"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg"
        dir={t("language") === "ar" ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {t("import_cars_from_csv")}
          </DialogTitle>
          <DialogDescription>{t("import_instructions")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download Section */}
          <div className="space-y-3">
            <h4 className="font-medium">{t("step_1_download_template")}</h4>
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t("download_csv_template")}
            </Button>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("fill_template_instructions")}
            </AlertDescription>
          </Alert>

          {/* Upload Section */}
          <div className="space-y-3">
            <h4 className="font-medium">{t("step_2_upload_template")}</h4>
            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {uploadProgress && (
                <p className="text-sm text-muted-foreground">
                  {uploadProgress}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarsImportModal;
