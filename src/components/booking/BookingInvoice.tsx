
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import SuccessConfirmation from './SuccessConfirmation';
import InvoiceHeader from './InvoiceHeader';
import InvoiceDetails from './InvoiceDetails';
import InvoiceTable from './InvoiceTable';
import InvoicePaymentSummary from './InvoicePaymentSummary';
import VendorDetails from './VendorDetails';
import InvoiceCarDetails from './InvoiceCarDetails';
import InvoiceFooter from './InvoiceFooter';

interface BookingInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  car: any;
  rentalDays: number;
  totalPrice: number;
  pricingType: string;
  selectedServices: string[];
}

const BookingInvoice = ({
  isOpen,
  onClose,
  bookingId,
  car,
  rentalDays,
  totalPrice,
  pricingType,
  selectedServices
}: BookingInvoiceProps) => {
  const prepayment = 1500;
  const remaining = totalPrice - prepayment;

  const generatePDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();

    // Set colors
    const primaryBlue = [52, 120, 246];
    const darkGray = [51, 51, 51];

    // Header with logo and company info
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(0, 0, 210, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('GET CAR', 20, 17);

    // Invoice title
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(20, 30, 170, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Invoice', 105, 38, { align: 'center' });

    // Company details section
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('GET CAR', 20, 55);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('+966 3243 2439', 20, 62);
    doc.text('getCar@gmail.com', 20, 68);
    doc.text('getCar.com', 20, 74);

    // Invoice details
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('INVOICE', 20, 90);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`#GC-${bookingId}`, 20, 98);
    doc.text(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), 20, 105);

    // Total amount box
    doc.setFillColor(255, 193, 7);
    doc.roundedRect(140, 85, 50, 25, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Total amount', 165, 95, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`${totalPrice.toLocaleString()} SAR`, 165, 105, { align: 'center' });

    // Bill to and Payment information
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Bill to', 20, 125);
    doc.text('Payment information', 110, 125);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Name: Ahmed mohamed', 20, 135);
    doc.text('Phone number: 01003834348', 20, 142);
    doc.text('Email: Ahmed@gmail.com', 20, 149);

    doc.text(`Prepayment: ${prepayment.toLocaleString()} SAR`, 110, 135);
    doc.text('Credit card: **** 1234', 110, 142);
    doc.text(`Post payment: ${remaining.toLocaleString()} SAR`, 110, 149);

    // Table header
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(20, 160, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Description', 25, 167);
    doc.text('Duration', 80, 167);
    doc.text('Price', 120, 167);
    doc.text('Total', 160, 167);

    // Table content
    let yPos = 175;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'normal');
    
    // Car rental charge
    doc.text('Car rental charge', 25, yPos);
    doc.text(`${rentalDays} days`, 80, yPos);
    doc.text(`${car.pricing[pricingType]} SAR/day`, 120, yPos);
    doc.text(`${(car.pricing[pricingType] * rentalDays).toLocaleString()} SAR`, 160, yPos);
    yPos += 8;

    // Services
    selectedServices.forEach(serviceId => {
      const serviceNames = {
        'insurance': 'Full protection',
        'gps': 'Navigation system',
        'driver': 'Additional driver',
        'delivery': 'Car delivery'
      };
      const servicePrices = {
        'insurance': 500,
        'gps': 0,
        'driver': 500,
        'delivery': 500
      };
      
      const serviceName = serviceNames[serviceId as keyof typeof serviceNames] || serviceId;
      const servicePrice = servicePrices[serviceId as keyof typeof servicePrices] || 0;
      
      doc.text(serviceName, 25, yPos);
      doc.text('-', 80, yPos);
      doc.text(`${servicePrice} SAR`, 120, yPos);
      doc.text(`${servicePrice} SAR`, 160, yPos);
      yPos += 8;
    });

    // Payment summary
    yPos += 5;
    doc.text(`Paid: ${prepayment.toLocaleString()} SAR`, 120, yPos);
    yPos += 8;
    doc.text(`Remaining: ${remaining.toLocaleString()} SAR`, 120, yPos);
    yPos += 8;
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ${totalPrice.toLocaleString()} SAR`, 120, yPos);

    // Vendor details
    yPos += 15;
    doc.setFont(undefined, 'bold');
    doc.text('Vendor details', 20, yPos);
    yPos += 8;
    doc.setTextColor(220, 53, 69);
    doc.setFontSize(12);
    doc.text('AVIS', 20, yPos);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    yPos += 8;
    doc.text('Phone number: 01003834348', 20, yPos);

    // Car details
    yPos += 15;
    doc.setFont(undefined, 'bold');
    doc.text('Car details', 20, yPos);
    yPos += 8;
    doc.setFont(undefined, 'normal');
    doc.text(`${car.name}`, 20, yPos);
    yPos += 6;
    doc.text('Hatchback car rental car', 20, yPos);

    // Footer
    yPos = 260;
    doc.text('Thank you for dealing with us!', 20, yPos);
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Company policy:', 20, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text('Please send payment within 30 days of receiving this invoice.', 20, yPos);
    yPos += 4;
    doc.text('There will be 10% interest charge per month on late invoice.', 20, yPos);

    // Signature
    doc.setFontSize(12);
    doc.setFont('times', 'italic');
    doc.text('Henrietta Mitchell', 150, 270);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Head of getCar', 150, 277);

    doc.save(`invoice-GC-${bookingId}.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-4xl w-full mx-auto max-h-[95vh] overflow-y-auto p-0 border-0">
        <div className="bg-cream min-h-full w-full">
          {/* Header */}
          <div className="bg-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Car className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold text-gradient">GET CAR</span>
            </div>
          </div>

          <SuccessConfirmation onGeneratePDF={generatePDF} />

          <div className="bg-white mx-2 sm:mx-4 md:mx-6 mb-3 sm:mb-4 md:mb-6 rounded-lg shadow-lg overflow-hidden">
            <InvoiceHeader />
            <InvoiceDetails 
              bookingId={bookingId}
              totalPrice={totalPrice}
              prepayment={prepayment}
              remaining={remaining}
            />
            <InvoiceTable 
              car={car}
              rentalDays={rentalDays}
              pricingType={pricingType}
              selectedServices={selectedServices}
            />
            <InvoicePaymentSummary 
              prepayment={prepayment}
              remaining={remaining}
              totalPrice={totalPrice}
            />
            <VendorDetails />
            <InvoiceCarDetails car={car} />
            <InvoiceFooter />
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            <Button onClick={onClose} variant="outline" className="w-full text-sm sm:text-base">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingInvoice;
