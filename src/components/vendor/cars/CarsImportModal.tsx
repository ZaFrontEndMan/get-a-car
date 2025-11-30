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
import { motion, AnimatePresence } from "framer-motion";
import {
  useBulkUploadCars,
  useDownloadCarTemplate,
} from "@/hooks/vendor/useVendorCar";
import { downloadCarTemplate } from "@/api/vendor/vendorCarApi";

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
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { mutate: bulkUploadCars, isPending: isUploadingCars } =
    useBulkUploadCars();
  const base64ToBlob = (
    base64: string,
    mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) => {
    // in case backend ever returns a data URL, strip prefix
    const clean = base64.includes(",") ? base64.split(",")[1] : base64;

    const binary = atob(clean);
    const len = binary.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mime });
  };
  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);

      const { fileContent, fileName, contentType } =
        await downloadCarTemplate();

      const blob = base64ToBlob(
        fileContent,
        contentType ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "CarTemplate.xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Template download error:", error);
      toast({
        title: t("download_error"),
        description: t("download_error_description", {
          errorMessage: error?.message || "Unknown error",
        }),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
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
    setUploadProgress(t("uploading_file"));
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    // Simulate progress for smoother UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 80));
    }, 500);

    bulkUploadCars(formData, {
      onSuccess: (data) => {
        clearInterval(progressInterval);
        setProgress(100);
        setUploadProgress(
          t("imported_cars", {
            imported: data.importedCount || 0,
            total: data.totalCount || 0,
          })
        );

        toast({
          title: t("import_successful"),
          description: t("import_successful_description", {
            importedCount: data.importedCount || 0,
          }),
        });

        onImportSuccess();
        onClose();
      },
      onError: (error) => {
        clearInterval(progressInterval);
        setProgress(0);
        console.error("File upload error:", error);
        toast({
          title: t("import_error"),
          description: t("import_error_description", {
            errorMessage: error.message || "Unknown error",
          }),
          variant: "destructive",
        });
      },
      onSettled: () => {
        clearInterval(progressInterval);
        setIsUploading(false);
        setUploadProgress("");
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
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
              onClick={handleDownloadTemplate}
              variant="outline"
              className="w-full flex items-center gap-2"
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" />
              {isDownloading ? t("downloading") : t("download_csv_template")}
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
                disabled={isUploading || isUploadingCars}
              />
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                    {uploadProgress && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {uploadProgress}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading || isUploadingCars || isDownloading}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarsImportModal;
