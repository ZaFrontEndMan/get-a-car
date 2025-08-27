
import React from 'react';

interface InvoicePaymentSummaryProps {
  prepayment: number;
  remaining: number;
  totalPrice: number;
}

const InvoicePaymentSummary = ({ prepayment, remaining, totalPrice }: InvoicePaymentSummaryProps) => {
  return (
    <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 px-3 sm:px-4 md:px-6">
      <div className="flex justify-between text-xs sm:text-sm">
        <span className="font-medium">Paid:</span>
        <span>{prepayment.toLocaleString()} SAR</span>
      </div>
      <div className="flex justify-between text-xs sm:text-sm">
        <span className="font-medium">Remaining:</span>
        <span>{remaining.toLocaleString()} SAR</span>
      </div>
      <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2">
        <span>Total:</span>
        <span>{totalPrice.toLocaleString()} SAR</span>
      </div>
    </div>
  );
};

export default InvoicePaymentSummary;
