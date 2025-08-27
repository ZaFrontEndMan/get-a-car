
import React from 'react';

const InvoiceHeader = () => {
  return (
    <div className="bg-primary text-white p-3 sm:p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold">GET CAR</h3>
          <p className="text-xs sm:text-sm text-blue-100">+966 3243 2439</p>
          <p className="text-xs sm:text-sm text-blue-100">getCar@gmail.com</p>
          <p className="text-xs sm:text-sm text-blue-100">getCar.com</p>
        </div>
        <div className="text-right">
          <div className="bg-primary-dark px-3 py-2 rounded-lg">
            <h4 className="text-sm sm:text-base font-bold">Invoice</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
