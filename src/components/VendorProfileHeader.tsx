import React from 'react';
import { Star, Shield, MapPin, Phone, Mail, Clock, Calendar, Car, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
interface VendorProfileHeaderProps {
  vendor: {
    id: string;
    name: string;
    logo: string;
    manager: string;
    phone: string;
    email: string;
    address: string;
    rating: number;
    reviews: number;
    verified: boolean;
    carsCount: number;
    joinedDate: string;
    description: string;
    workingHours: string;
  };
}
const VendorProfileHeader = ({
  vendor
}: VendorProfileHeaderProps) => {
  const {
    t
  } = useLanguage();

  // Use the uploaded vendor images based on vendor ID
  const vendorImages = ['/uploads/984c47f8-006e-44f4-8059-24f7f00bc865.png',
  // Yelo
  '/uploads/019e4079-36bc-4104-b9ba-0f4e0ea897a6.png',
  // Sixt
  '/uploads/766b092f-f791-45f7-b296-387396496c28.png',
  // Avis
  '/uploads/8ea2ddab-da0e-4e94-869e-44a59b761085.png',
  // Budget
  '/uploads/3ea6ca2a-9bdf-4a51-8e0e-722188a4ea31.png',
  // Hertz
  '/uploads/3dbfcf21-ea34-4d7c-8136-362bcea338de.png' // RAK Transport
  ];

  // Select an image based on vendor ID for consistency
  const imageIndex = parseInt(vendor.id) % vendorImages.length;
  const vendorImage = vendorImages[imageIndex];
  return <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Professional Cover Section */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
          <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 rtl:space-x-reverse">
            {/* Professional Logo - Fixed mobile size */}
            <div className="relative flex-shrink-0 self-center sm:self-auto">
              <img src={vendorImage} alt={vendor.name} className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-3 sm:border-4 border-white shadow-2xl object-cover bg-white p-1 sm:p-2" />
              {vendor.verified && <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-blue-500 text-white p-1 sm:p-2 rounded-full shadow-lg">
                  <Shield className="h-3 w-3 sm:h-5 sm:w-5" />
                </div>}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 text-white text-center sm:text-left pb-2 sm:pb-4">
              <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{vendor.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                <div className="flex items-center justify-center sm:justify-start space-x-1 rtl:space-x-reverse bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-sm sm:text-base">{vendor.rating}</span>
                  <span className="text-xs sm:text-sm">({vendor.reviews} {t('reviews')})</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-1 rtl:space-x-reverse bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{t('since')} {vendor.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-8">
        {/* Description */}
        <div className="mb-6 sm:mb-8">
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-6 rounded-xl text-center border border-primary/10">
            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-primary">{vendor.carsCount}</div>
            <div className="text-xs sm:text-sm text-gray-600">{t('carsAvailable')}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-xl text-center border border-yellow-200">
            <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-yellow-700">{vendor.rating}</div>
            <div className="text-xs sm:text-sm text-gray-600">{t('rating')}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl text-center border border-green-200">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-green-700">{vendor.reviews}</div>
            <div className="text-xs sm:text-sm text-gray-600">{t('reviews')}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl text-center border border-blue-200">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-blue-700">{t('verified')}</div>
            <div className="text-xs sm:text-sm text-gray-600">{t('status')}</div>
          </div>
        </div>

        {/* Contact & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Information */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span>{t('contactInfo')}</span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm sm:text-base text-gray-700">{vendor.phone}</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm sm:text-base text-gray-700">{vendor.email}</span>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <span className="text-sm sm:text-base text-gray-700">{vendor.address}</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          
        </div>
      </div>
    </div>;
};
export default VendorProfileHeader;