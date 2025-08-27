
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Calendar, CreditCard, User, FileText, Globe, Building } from 'lucide-react';

interface ClientInfoCardProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    joinedDate: string;
    driverLicenseNumber?: string;
  };
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({ client }) => {
  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="flex items-center text-lg">
          <User className="h-5 w-5 mr-2 text-primary" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-1">
              Contact Information
            </h3>
            
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Client ID</p>
                <p className="text-sm text-gray-600 font-mono">{client.id}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600 break-all">{client.email}</p>
              </div>
            </div>
            
            {client.phone && (
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{client.phone}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Joined</p>
                <p className="text-sm text-gray-600">
                  {new Date(client.joinedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          {(client.address || client.city) && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-1">
                Location Information
              </h3>
              
              {client.city && (
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">City</p>
                    <p className="text-sm text-gray-600">{client.city}</p>
                  </div>
                </div>
              )}

              {client.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{client.address}</p>
                  </div>
                </div>
              )}

              {/* Country - Saudi Arabia by default for now */}
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Country</p>
                  <p className="text-sm text-gray-600">Saudi Arabia</p>
                </div>
              </div>
            </div>
          )}

          {/* Document Information */}
          {client.driverLicenseNumber && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-1">
                Document Information
              </h3>
              
              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Driver License Number</p>
                  <p className="text-sm text-gray-600 font-mono">{client.driverLicenseNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!client.phone && !client.address && !client.city && !client.driverLicenseNumber && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">
                Additional client information will appear here when available
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoCard;
