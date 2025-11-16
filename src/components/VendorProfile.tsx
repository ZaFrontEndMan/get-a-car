import React from 'react';
import { MapPin, Phone, Mail, Globe, Star, Verified, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VendorPoliciesDisplay from './VendorPoliciesDisplay';
import LazyImage from './ui/LazyImage';

interface VendorProfileProps {
  vendor: {
    id: string;
    name: string;
    description?: string;
    rating?: number;
    total_reviews?: number;
    logo_url?: string;
    location?: string;
    phone?: string;
    email?: string;
    website?: string;
    verified?: boolean;
  };
}

const VendorProfile = ({ vendor }: VendorProfileProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Mobile-optimized header */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:gap-6">
            {/* Logo - Mobile optimized */}
            <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
              {vendor.logo_url ? (
                <LazyImage
                  src={vendor.logo_url}
                  alt={vendor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Vendor info - Mobile optimized */}
            <div className="flex-1 text-center sm:text-left w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{vendor.name}</h1>
                  {vendor.verified && (
                    <Badge className="bg-blue-100 text-blue-800 flex items-center">
                      <Verified className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rating */}
              {vendor.rating && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(vendor.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {vendor.rating} ({vendor.total_reviews || 0} reviews)
                  </span>
                </div>
              )}

              {/* Description */}
              {vendor.description && (
                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
                  {vendor.description}
                </p>
              )}

              {/* Contact info - Mobile optimized */}
              <div className="space-y-2">
                {vendor.location && (
                  <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{vendor.location}</span>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 space-y-2 sm:space-y-0">
                  {vendor.phone && (
                    <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{vendor.phone}</span>
                    </div>
                  )}
                  
                  {vendor.email && (
                    <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                  )}
                  
                  {vendor.website && (
                    <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline truncate"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons - Mobile optimized */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto">
              Contact Vendor
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              View All Cars
            </Button>
          </div>
        </div>
      </div>

      {/* Vendor Policies Section */}
      <VendorPoliciesDisplay vendorId={vendor.id} />
    </div>
  );
};

export default VendorProfile;
