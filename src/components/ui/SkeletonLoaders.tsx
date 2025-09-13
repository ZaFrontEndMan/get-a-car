import React from 'react';

// Skeleton for Car Cards
export const CarCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <div className="h-4 bg-gray-300 rounded w-12"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

// Skeleton for Offer Cards
export const OfferCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="relative">
        <div className="h-48 bg-gray-300"></div>
        <div className="absolute top-4 right-4 w-16 h-6 bg-gray-400 rounded-full"></div>
        <div className="absolute bottom-3 left-3 w-10 h-10 bg-gray-400 rounded-full"></div>
      </div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

// Skeleton for Vendor Cards
export const VendorCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center animate-pulse">
      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-4 w-3/4 mx-auto"></div>
      <div className="flex justify-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
        ))}
      </div>
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  );
};

// Section Header Skeleton
export const SectionHeaderSkeleton = () => {
  return (
    <div className="flex justify-between items-center mb-16 animate-pulse">
      <div>
        <div className="h-10 bg-gray-300 rounded mb-4 w-64"></div>
        <div className="w-24 h-1 bg-gray-300 rounded-full"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-20"></div>
    </div>
  );
};

// Grid Skeleton Layouts
export const CarsGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <CarCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const OffersGridSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <OfferCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const VendorsGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <VendorCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Complete Section Skeleton
export const SectionSkeleton = ({ 
  type, 
  count 
}: { 
  type: 'cars' | 'offers' | 'vendors', 
  count?: number 
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        {type === 'cars' && <CarsGridSkeleton count={count} />}
        {type === 'offers' && <OffersGridSkeleton count={count} />}
        {type === 'vendors' && <VendorsGridSkeleton count={count} />}
      </div>
    </section>
  );
};