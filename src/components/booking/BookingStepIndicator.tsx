
import React from 'react';
import { cn } from '@/lib/utils';

interface BookingStepIndicatorProps {
  currentStep: number;
}

const BookingStepIndicator = ({ currentStep }: BookingStepIndicatorProps) => {
  const steps = [
    { number: 1, title: 'Date & Location', subtitle: 'تاريخ وموقع' },
    { number: 2, title: 'Driver Option', subtitle: 'خيار السائق' },
    { number: 3, title: 'Payment', subtitle: 'الدفع' }
  ];

  return (
    <div className="flex justify-between items-center mb-6 px-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-col items-center flex-1">
          <div className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-colors",
            currentStep >= step.number 
              ? "bg-primary text-white" 
              : "bg-gray-200 text-gray-500"
          )}>
            {step.number}
          </div>
          <div className="text-center mt-2">
            <p className="text-xs sm:text-sm font-medium">{step.title}</p>
            <p className="text-xs text-gray-500">{step.subtitle}</p>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "absolute h-px w-full top-4 sm:top-5 left-1/2 -z-10",
              currentStep > step.number ? "bg-primary" : "bg-gray-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingStepIndicator;
