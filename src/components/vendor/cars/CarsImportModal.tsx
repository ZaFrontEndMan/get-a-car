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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { mutate: downloadTemplate, isPending: isDownloading } =
    useDownloadCarTemplate();
  const { mutate: bulkUploadCars, isPending: isUploadingCars } =
    useBulkUploadCars();

  const handleDownloadTemplate = () => {
    downloadTemplate(undefined, {
      onSuccess: (base64File: string, variables) => {
        try {
          // Decode base64 to bytes
          const paddedBase64 = base64File
            .replace(/(\r\n|\n)/g, "\\n")
            .replace(/[^A-Za-z0-9+/\\n=\\s]/g, "");

          // Fix padding if needed
          let base64String = paddedBase64;
          while (base64String.length % 4) {
            base64String += "=";
          }

          // Decode base64 to binary data
          const binaryString = atob(base64String);
          const bytes = new Uint8Array(binaryString.length);

          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Create blob from binary data
          const blob = new Blob([bytes], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);

          // Download the decoded file
          const link = document.createElement("a");
          link.href = url;
          link.download = "cars_template.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast({
            title: t("template_downloaded"),
            description: t("template_downloaded_description"),
          });
        } catch (error) {
          console.error("Error decoding file:", error);

          // Fallback: try direct download if decoding fails
          const url = window.URL.createObjectURL(
            new Blob([base64File], { type: "application/octet-stream" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.download = "cars_template.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast({
            title: t("download_error"),
            description: t("fallback_download_warning"),
            variant: "destructive",
          });
        }
      },
      onError: (error) => {
        console.error("Template download error:", error);
        toast({
          title: t("download_error"),
          description: t("download_error_description"),
          variant: "destructive",
        });
      },
    });
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
