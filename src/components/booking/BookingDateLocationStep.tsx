import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { BookingFormData } from "./bookingSchema";
import { useLanguage } from "@/contexts/LanguageContext";

interface BookingDateLocationStepProps {
  control: Control<BookingFormData>;
  watchedPickupDate: Date;
  selectedPickup?: string;
  selectedDropoff?: string;
  pickupLocations: string[];
  dropoffLocations: string[];
}

const BookingDateLocationStep = ({
  control,
  watchedPickupDate,
  selectedPickup,
  selectedDropoff,
  pickupLocations,
  dropoffLocations,
}: BookingDateLocationStepProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm">{t("pickupDate")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left rtl:justify-end font-normal h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t("selectDate")}</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dropoffDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm">{t("returnDate")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left rtl:justify-end font-normal h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t("selectDate")}</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date <= watchedPickupDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{t("pickupLocation")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || selectedPickup}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={t("selectPickupLocation")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pickupLocations?.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dropoffLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">
                  {t("dropoffLocation")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || selectedDropoff}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={t("selectDropoffLocation")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropoffLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDateLocationStep;
