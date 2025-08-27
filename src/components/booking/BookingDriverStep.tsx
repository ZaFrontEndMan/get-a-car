
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { User } from 'lucide-react';
import { Control } from 'react-hook-form';
import { BookingFormData } from './bookingSchema';

interface BookingDriverStepProps {
  control: Control<BookingFormData>;
  needsDriver: boolean;
}

const BookingDriverStep = ({ control, needsDriver }: BookingDriverStepProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 justify-center sm:justify-start">
        <User className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Driver Option / خيار السائق</span>
      </h3>

      <FormField
        control={control}
        name="needsDriver"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-sm sm:text-base">
                Do you need a driver? / هل تحتاج سائق؟
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {needsDriver && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm sm:text-base">Driver Information / معلومات السائق</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Full Name / الاسم الكامل *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Driving License Number / رقم الرخصة *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter license number" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Phone Number / رقم الهاتف *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDriverStep;
