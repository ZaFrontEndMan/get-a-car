import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Star, Car, Calendar, Shield } from 'lucide-react';

interface VendorDetailsHeaderProps {
  vendor: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    rating: number;
    total_reviews: number;
    created_at: string;
    logo_url?: string;
  };
  carsCount: number;
  branchesCount: number;
  onBackClick: () => void;
}

const VendorDetailsHeader: React.FC<VendorDetailsHeaderProps> = ({
  vendor,
  carsCount,
  branchesCount,
  onBackClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBackClick}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              {vendor.logo_url ? (
                <img 
                  src={vendor.logo_url} 
                  alt={vendor.name} 
                  className="w-12 h-12 rounded-full object-cover bg-white p-1"
                />
              ) : (
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">{vendor.name}</h1>
                  <Badge 
                    variant={vendor.verified ? 'default' : 'secondary'}
                    className="bg-white/20 text-white border-white/30"
                  >
                    {vendor.verified ? (
                      <><Shield className="h-3 w-3 mr-1" />Verified</>
                    ) : (
                      'Unverified'
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-white/90">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{vendor.rating || '0.0'}</span>
                  <span>({vendor.total_reviews || 0} reviews)</span>
                </div>
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
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Cars</p>
                <p className="text-2xl font-bold text-blue-900">{carsCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Branches</p>
                <p className="text-2xl font-bold text-green-900">{branchesCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Rating</p>
                <p className="text-2xl font-bold text-yellow-900">{vendor.rating || '0.0'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Joined</p>
                <p className="text-lg font-bold text-purple-900">
                  {new Date(vendor.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsHeader;
