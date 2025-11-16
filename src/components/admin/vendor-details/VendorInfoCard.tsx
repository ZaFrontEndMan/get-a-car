import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Phone, Mail, MapPin, Calendar, Star, Car, CreditCard, FileText, Globe2 } from 'lucide-react';
import { VendorDetails } from './types';
import LazyImage from '@/components/ui/LazyImage';

interface VendorInfoCardProps {
  vendor: VendorDetails;
  carsCount: number;
  branchesCount: number;
}

export const VendorInfoCard: React.FC<VendorInfoCardProps> = ({ vendor, carsCount, branchesCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {vendor.logo_url ? (
            <LazyImage src={vendor.logo_url} alt={vendor.name} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span>{vendor.name}</span>
              <Badge variant={vendor.verified ? "default" : "secondary"}>
                {vendor.verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>{vendor.rating || '0.0'}</span>
              <span>({vendor.total_reviews || 0} reviews)</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-gray-600">{vendor.email}</p>
            </div>
          </div>
          
          {vendor.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-gray-600">{vendor.phone}</p>
              </div>
            </div>
          )}

          {vendor.country && (
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Country</p>
                <p className="text-sm text-gray-600">{vendor.country}</p>
              </div>
            </div>
          )}

          {vendor.city && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">City</p>
                <p className="text-sm text-gray-600">{vendor.city}</p>
              </div>
            </div>
          )}

          {vendor.national_id && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">National ID</p>
                <p className="text-sm text-gray-600">{vendor.national_id}</p>
              </div>
            </div>
          )}

          {vendor.license_id && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">License ID</p>
                <p className="text-sm text-gray-600">{vendor.license_id}</p>
              </div>
            </div>
          )}

          {vendor.date_of_birth && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Date of Birth</p>
                <p className="text-sm text-gray-600">
                  {new Date(vendor.date_of_birth).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Joined</p>
              <p className="text-sm text-gray-600">
                {new Date(vendor.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Total Cars</p>
              <p className="text-sm text-gray-600">{carsCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Branches</p>
              <p className="text-sm text-gray-600">{branchesCount}</p>
            </div>
          </div>
        </div>

        {vendor.description && (
          <div className="mt-4">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-gray-600 mt-1">{vendor.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};