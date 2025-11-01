import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import VendorSignUp from "./auth/VendorSignUp";

interface VendorSignUpDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const VendorSignUpDialog = ({
  isOpen,
  onOpenChange,
}: VendorSignUpDialogProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Header */}
              <motion.div
                className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 flex items-center justify-between z-10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <h2 className="text-2xl font-bold">
                    {t("vendorSignUpTitle")}
                  </h2>
                  <p className="text-white/90 text-sm mt-1">
                    {t("vendorSignUpDescription")}
                  </p>
                </div>
                <motion.button
                  onClick={() => onOpenChange(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </motion.div>

              {/* Content */}
              <motion.div
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <VendorSignUp onSuccess={() => onOpenChange(false)} />
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VendorSignUpDialog;
