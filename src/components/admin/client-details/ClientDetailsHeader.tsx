
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Shield, Calendar, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientDetailsHeaderProps {
  clientName: string;
  clientStatus: string;
  totalBookings: number;
  totalSpent: number;
  joinedDate: string;
  onBackClick: () => void;
}

const ClientDetailsHeader: React.FC<ClientDetailsHeaderProps> = ({
  clientName,
  clientStatus,
  totalBookings,
  totalSpent,
  joinedDate,
  onBackClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBackClick}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{clientName}</h1>
                <Badge 
                  variant={clientStatus === 'active' ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {clientStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-900">{totalBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-900">SAR {totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Joined</p>
                <p className="text-lg font-bold text-purple-900">{new Date(joinedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Status</p>
                <p className="text-lg font-bold text-orange-900 capitalize">{clientStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsHeader;
