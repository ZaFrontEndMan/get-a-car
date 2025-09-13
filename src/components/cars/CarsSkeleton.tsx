import React from "react";

interface CarsSkeletonProps {
  viewMode?: "grid" | "list";
  itemsPerPage?: number;
}

const CarsSkeleton = ({ viewMode = "grid", itemsPerPage = 12 }: CarsSkeletonProps) => {
  const skeletonItems = Array.from({ length: itemsPerPage }, (_, index) => index);

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {skeletonItems.map((index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse"
          >
            <div className="flex gap-6">
              {/* Image skeleton */}
              <div className="w-48 h-32 bg-gray-200 rounded-xl flex-shrink-0"></div>
              
              {/* Content skeleton */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skeletonItems.map((index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200"></div>
          
          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
            </div>
            
            <div className="pt-2">
              <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton component for Cars page filters section
 */
export const CarsFiltersSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
      <div className="space-y-6">
        {/* Search and view controls skeleton */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
          <div className="flex gap-2">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        
        {/* Filter options skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
        
        {/* Results info skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton component for Cars page search controls
 */
export const CarsSearchControlsSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-40"></div>
        <div className="h-8 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  );
};

export default CarsSkeleton;