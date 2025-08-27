
import React from 'react';

const VendorDetails = () => {
  return (
    <div className="mb-4 sm:mb-6 px-3 sm:px-4 md:px-6">
      <h5 className="text-sm font-semibold mb-2 sm:mb-3">Vendor details</h5>
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
        <div className="text-red-600 font-bold text-base sm:text-lg mb-2">AVIS</div>
        <div className="text-xs sm:text-sm space-y-1">
          <div><span className="font-medium">Phone number:</span> 01003834348</div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
