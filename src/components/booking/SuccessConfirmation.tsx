
import React from 'react';
import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessConfirmationProps {
  onGeneratePDF: () => void;
}

const SuccessConfirmation = ({ onGeneratePDF }: SuccessConfirmationProps) => {
  return (
    <div className="text-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="relative mb-4 sm:mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-green-500 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
          <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
        </div>
        {/* Confetti decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full animate-bounce" 
              style={{
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }} 
            />
          ))}
        </div>
      </div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
        Booking confirmed successfully
      </h2>
      <p className="text-sm text-gray-600 mb-6 sm:mb-8 px-2">
        Great choice! We hope you enjoy your drive 😊
      </p>
      
      <div className="flex justify-center">
        <Button 
          onClick={onGeneratePDF} 
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 text-sm font-medium flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Invoice
        </Button>
      </div>
    </div>
  );
};

export default SuccessConfirmation;
