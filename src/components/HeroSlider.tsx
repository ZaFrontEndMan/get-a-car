import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const HeroSlider = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isRTL = language === "ar";

  // Fetch slides from database
  const { data: slides, isLoading } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (error) throw error;
      return data || [];
    },
  });

  // Fallback slides if no data or loading
  const fallbackSlides = useMemo(() => [
    {
      id: "1",
      image_url: "/uploads/019e4079-36bc-4104-b9ba-0f4e0ea897a6.png",
      title: t("heroSlider.slide1.title") || "Premium Car Rental",
      title_ar: "تأجير السيارات المميز",
      subtitle:
        t("heroSlider.slide1.subtitle") ||
        "Experience luxury and comfort with our premium fleet",
      subtitle_ar: "اختبر الفخامة والراحة مع أسطولنا المميز",
      button_text: "Book Now",
      button_text_ar: "احجز الآن",
      button_url: "/cars",
      order_index: 1,
    },
    {
      id: "2",
      image_url: "/uploads/035415fe-c520-495d-9eed-a57977e24db2.png",
      title: t("heroSlider.slide2.title") || "Best Deals Available",
      title_ar: "أفضل العروض المتاحة",
      subtitle:
        t("heroSlider.slide2.subtitle") ||
        "Find amazing deals on top-rated vehicles",
      subtitle_ar: "اعثر على عروض مذهلة على المركبات الأعلى تقييماً",
      button_text: "View Offers",
      button_text_ar: "عرض العروض",
      button_url: "/offers",
      order_index: 2,
    },
    {
      id: "3",
      image_url: "/uploads/10b7fec1-615a-4b01-ae08-d35764ce917a.png",
      title: t("heroSlider.slide3.title") || "Trusted by Thousands",
      title_ar: "موثوق من الآلاف",
      subtitle:
        t("heroSlider.slide3.subtitle") ||
        "Join thousands of satisfied customers",
      subtitle_ar: "انضم إلى آلاف العملاء الراضين",
      button_text: "Learn More",
      button_text_ar: "اعرف المزيد",
      button_url: "/about",
      order_index: 3,
    },
  ], [t, language]);

  const displaySlides = isLoading || !slides?.length ? fallbackSlides : slides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  }, [displaySlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + displaySlides.length) % displaySlides.length
    );
  }, [displaySlides.length]);

  useEffect(() => {
    if (displaySlides.length > 0) {
      const interval = setInterval(nextSlide, 7000);
      return () => clearInterval(interval);
    }
  }, [displaySlides.length, nextSlide]);

  const handleButtonClick = (url?: string | null) => {
    if (url) {
      if (url.startsWith("/")) {
        window.location.href = url;
      } else {
        window.open(url, "_blank");
      }
    }
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
          className="absolute inset-0"
        >
          <img
            src={displaySlides[currentSlide]?.image_url}
            alt={
              language === "ar" && displaySlides[currentSlide]?.title_ar 
                ? displaySlides[currentSlide].title_ar 
                : displaySlides[currentSlide]?.title
            }
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
              >
                {language === "ar" && displaySlides[currentSlide]?.title_ar
                  ? displaySlides[currentSlide].title_ar
                  : displaySlides[currentSlide]?.title}
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
              >
                {language === "ar" && displaySlides[currentSlide]?.subtitle_ar
                  ? displaySlides[currentSlide].subtitle_ar
                  : displaySlides[currentSlide]?.subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
              >
                {displaySlides[currentSlide]?.button_text && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl"
                      onClick={() =>
                        handleButtonClick(displaySlides[currentSlide]?.button_url)
                      }
                    >
                      {language === "ar" &&
                      displaySlides[currentSlide]?.button_text_ar
                        ? displaySlides[currentSlide].button_text_ar
                        : displaySlides[currentSlide]?.button_text}
                    </Button>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                    onClick={() => handleButtonClick("/vendors")}
                  >
                    {t("topVendors") || "Browse Vendors"}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className={`absolute top-1/2 transform -translate-y-1/2 ${
          isRTL ? "right-4" : "left-4"
        } bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 group`}
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: "rgba(255, 255, 255, 0.3)" 
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          whileHover={{ x: isRTL ? 2 : -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isRTL ? (
            <ChevronRight className="h-6 w-6 transition-transform" />
          ) : (
            <ChevronLeft className="h-6 w-6 transition-transform" />
          )}
        </motion.div>
      </motion.button>
      <motion.button
        onClick={nextSlide}
        className={`absolute top-1/2 transform -translate-y-1/2 ${
          isRTL ? "left-4" : "right-4"
        } bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 group`}
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: "rgba(255, 255, 255, 0.3)" 
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          whileHover={{ x: isRTL ? -2 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isRTL ? (
            <ChevronLeft className="h-6 w-6 transition-transform" />
          ) : (
            <ChevronRight className="h-6 w-6 transition-transform" />
          )}
        </motion.div>
      </motion.button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {displaySlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: index === currentSlide ? 1.25 : 1,
              backgroundColor: index === currentSlide 
                ? "rgba(255, 255, 255, 1)" 
                : "rgba(255, 255, 255, 0.5)"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 17 
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
