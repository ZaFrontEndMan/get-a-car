
import React from 'react';

const InvoiceFooter = () => {
  return (
    <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
      <div className="border-t pt-4 space-y-3 sm:space-y-4">
        <p className="text-sm font-medium">Thank you for dealing with us!</p>
        
        <div>
          <h6 className="text-sm font-bold mb-2">Company policy:</h6>
          <div className="text-xs space-y-1 text-gray-600">
            <p>Please send payment within 30 days of receiving this invoice.</p>
            <p>There will be 10% interest charge per month on late invoice.</p>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <div className="text-right">
            <div className="text-base font-bold italic">Henrietta Mitchell</div>
            <div className="text-xs text-gray-600">Head of getCar</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
