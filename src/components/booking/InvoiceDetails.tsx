
import React from 'react';
import { format } from 'date-fns';

interface InvoiceDetailsProps {
  bookingId: string;
  totalPrice: number;
  prepayment: number;
  remaining: number;
}

const InvoiceDetails = ({ bookingId, totalPrice, prepayment, remaining }: InvoiceDetailsProps) => {
  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 sm:mb-6">
        <div>
          <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">INVOICE</h4>
          <p className="text-sm text-gray-600 mb-1">#GC-{bookingId}</p>
          <p className="text-sm text-gray-600">{format(new Date(), 'dd MMM, yyyy')}</p>
        </div>
        <div className="lg:text-right">
          <p className="text-base sm:text-lg font-semibold mb-2">Total amount</p>
          <div className="bg-gold px-3 py-2 rounded-lg inline-block">
            <span className="text-lg sm:text-xl md:text-2xl font-bold">{totalPrice.toLocaleString()}</span>
            <span className="text-sm ml-1">SAR</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 sm:mb-6">
        {/* Bill To */}
        <div>
          <h5 className="text-sm font-semibold mb-2">Bill to</h5>
          <div className="space-y-1 text-xs sm:text-sm">
            <div><span className="font-medium">Name:</span> Ahmed mohamed</div>
            <div><span className="font-medium">Phone number:</span> 01003834348</div>
            <div><span className="font-medium">Email:</span> Ahmed@gmail.com</div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h5 className="text-sm font-semibold mb-2">Payment information</h5>
          <div className="space-y-1 text-xs sm:text-sm">
            <div><span className="font-medium">Prepayment:</span> {prepayment.toLocaleString()} SAR</div>
            <div><span className="font-medium">Credit card:</span> **** 1234</div>
            <div><span className="font-medium">Post payment:</span> {remaining.toLocaleString()} SAR</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
