
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { Download, Car } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, payment }) => {
  const { t } = useLanguage();

  if (!payment) return null;

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading PDF for payment:', payment.id);
    alert('PDF download functionality would be implemented here');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{t('invoice')}</DialogTitle>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>{t('downloadPDF')}</span>
          </button>
        </DialogHeader>

        <div className="bg-white p-8 border border-gray-200 rounded-lg">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="gradient-primary p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Get Car</h1>
                <p className="text-gray-600">{t('carRentalService')}</p>
              </div>
            </div>
            <div className="text-right rtl:text-left">
              <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-gray-600">#{payment.bookingId}</p>
              <p className="text-gray-600">{payment.date}</p>
            </div>
          </div>

          {/* Customer & Vendor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('customer')}</h3>
              <div className="text-gray-600">
                <p>Ahmed Hassan</p>
                <p>ahmed@example.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('vendor')}</h3>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                <img src={payment.vendorLogo} alt={payment.vendor} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-medium">{payment.vendor}</p>
                  <p>vendor@{payment.vendor.toLowerCase().replace(' ', '')}.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">{t('bookingDetails')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">{t('vehicle')}: <span className="font-medium text-gray-900">{payment.booking}</span></p>
                <p className="text-gray-600">{t('rentalDays')}: <span className="font-medium text-gray-900">{payment.rentalDays} days</span></p>
              </div>
              <div>
                <p className="text-gray-600">{t('pickupLocation')}: <span className="font-medium text-gray-900">{payment.pickupLocation}</span></p>
                <p className="text-gray-600">{t('dropoffLocation')}: <span className="font-medium text-gray-900">{payment.dropoffLocation}</span></p>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left rtl:text-right text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t('description')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t('days')}
                  </th>
                  <th className="px-4 py-3 text-right rtl:text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t('amount')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {payment.booking} Rental
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                    {payment.rentalDays}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right rtl:text-left border-b border-gray-200">
                    {payment.amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">{t('total')}</span>
                <span className="font-bold text-xl text-primary">{payment.amount}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>{t('thankYou')}</p>
            <p className="text-sm mt-2">Get Car - Your trusted car rental partner</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
