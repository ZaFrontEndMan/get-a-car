
import React from 'react';
import { Car, Filter } from 'lucide-react';

interface EmptyBookingsStateProps {
  isFiltered: boolean;
  statusFilter: string;
}

const EmptyBookingsState = ({ isFiltered, statusFilter }: EmptyBookingsStateProps) => {
  if (isFiltered) {
    return (
      <div className="text-center py-12">
        <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No {statusFilter} bookings</h3>
        <p className="text-gray-500">No bookings found with the selected status</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
      <p className="text-gray-500">You don't have any bookings yet</p>
    </div>
  );
};

export default EmptyBookingsState;
