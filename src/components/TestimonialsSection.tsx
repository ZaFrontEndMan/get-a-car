import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "../contexts/LanguageContext";
import { useAdminSettings } from "../hooks/useAdminSettings";
import LazyImage from "./ui/LazyImage";

const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const { data: settings, isLoading } = useAdminSettings();
  const testimonials = settings?.approvedFeedback || [];
  const isRTL = language === "ar";

  const getAverageRating = (feedback: any) => {
    const ratings = [
      feedback.ratingVendor,
      feedback.ratingCar,
      feedback.ratingApp,
      feedback.ratingBooking,
    ].filter((r) => r !== null && r !== undefined);

    if (ratings.length === 0) return 0;
    return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 w-64 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("testimonials")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("testimonialsDescription") ||
              "Hear what our customers say about their experience with our car rental service"}
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className={` me-4`}>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.feedbackId}
                className={` basis-full md:basis-1/2 lg:basis-1/4`}
              >
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Quote className={`h-6 w-6 text-primary `} />
                      <div className={`flex`}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < getAverageRating(testimonial)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className={`text-gray-600 mb-4 leading-relaxed `}>
                      "{testimonial.comments}"
                    </p>

                    <div className={`flex items-center gap-2`}>
                      {testimonial.customerImage ? (
                        <LazyImage
                          src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                            testimonial.customerImage
                          }`}
                          alt={`${testimonial.fristName} ${testimonial.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                          {getInitials(
                            testimonial.fristName,
                            testimonial.lastName
                          )}
                        </div>
                      )}
                      <div>
                        <p className={`font-medium text-gray-900 `}>
                          {testimonial.fristName} {testimonial.lastName}
                        </p>
                        {testimonial.address && (
                          <p className={`text-sm text-gray-500 `}>
                            {testimonial.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
