import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import TestimonialForm from "./TestimonialForm";

interface Testimonial {
  id: string;
  name: string;
  name_ar?: string;
  comment: string;
  comment_ar?: string;
  rating: number;
  location?: string;
  location_ar?: string;
  avatar_url?: string;
  is_featured: boolean;
}

const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = language === "ar";

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("order_index", {
          ascending: true,
        });
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = (testimonial: Testimonial) => {
    return language === "ar" && testimonial.name_ar
      ? testimonial.name_ar
      : testimonial.name;
  };

  const getDisplayComment = (testimonial: Testimonial) => {
    return language === "ar" && testimonial.comment_ar
      ? testimonial.comment_ar
      : testimonial.comment;
  };

  const getDisplayLocation = (testimonial: Testimonial) => {
    return language === "ar" && testimonial.location_ar
      ? testimonial.location_ar
      : testimonial.location;
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

  return (
    <section className="py-16 bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
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

        {showForm && user ? (
          <div className="mb-12">
            <TestimonialForm />
          </div>
        ) : null}

        {testimonials.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
              direction: isRTL ? "rtl" : "ltr",
            }}
            className="w-full"
          >
            <CarouselContent className={isRTL ? "-mr-4" : "-ml-4"}>
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className={`${
                    isRTL ? "pr-4" : "pl-4"
                  } basis-full md:basis-1/2 lg:basis-1/4`}
                >
                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6">
                      <div
                        className={`flex items-center mb-4 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Quote
                          className={`h-6 w-6 text-primary ${
                            isRTL ? "ml-2" : "mr-2"
                          }`}
                        />
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p
                        className={`text-gray-600 mb-4 leading-relaxed ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        "{getDisplayComment(testimonial)}"
                      </p>

                      <div
                        className={`flex items-center ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        {testimonial.avatar_url ? (
                          <img
                            src={testimonial.avatar_url}
                            alt={getDisplayName(testimonial)}
                            className={`w-10 h-10 rounded-full ${
                              isRTL ? "ml-3" : "mr-3"
                            }`}
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center ${
                              isRTL ? "ml-3" : "mr-3"
                            } font-medium`}
                          >
                            {getDisplayName(testimonial).charAt(0)}
                          </div>
                        )}
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="font-medium text-gray-900">
                            {getDisplayName(testimonial)}
                          </p>
                          {testimonial.location ? (
                            <p className="text-sm text-gray-500">
                              {getDisplayLocation(testimonial)}
                            </p>
                          ) : null}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {t("noTestimonialsYet") || "No testimonials yet"}
            </p>
            {user ? (
              <Button onClick={() => setShowForm(true)} variant="outline">
                <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("beTheFirst") || "Be the first to share your experience"}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
