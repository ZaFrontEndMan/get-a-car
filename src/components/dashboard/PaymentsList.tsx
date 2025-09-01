import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useGetAllInvoices } from "@/hooks/client/useInvoices";
import {
  CreditCard,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

const PaymentsList: React.FC = () => {
  const { t, language } = useLanguage();
  const { data, isLoading } = useGetAllInvoices();
  const isRTL = language === "ar";

  const invoices = data?.data?.items || [];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noInvoices")}
        </h3>
        <p className="text-gray-600">{t("noInvoicesMessage")}</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h1
        className={`text-2xl font-bold text-gray-900 mb-6 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("invoices")} ({invoices.length})
      </h1>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.invoiceId}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div
              className={`flex justify-between items-start mb-4 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex items-center space-x-3 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                {getStatusIcon(invoice.status)}
                <div className={isRTL ? "text-right" : "text-left"}>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("currency")} {invoice.totalPrice.toFixed(2)}
                  </h3>
                  <p className="text-gray-600">
                    {invoice.carName || t("noCar")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("vendor")}: {invoice.vendorName}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  invoice.status
                )}`}
              >
                {t(invoice.status.toLowerCase())}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`flex items-center space-x-2 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                <Calendar className="h-4 w-4 text-gray-400" />
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-sm font-medium">{t("fromDate")}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(invoice.fromDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center space-x-2 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                <Car className="h-4 w-4 text-gray-400" />
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-sm font-medium">{t("toDate")}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(invoice.toDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsList;
