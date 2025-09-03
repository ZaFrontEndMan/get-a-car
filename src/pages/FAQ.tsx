
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFAQs } from '../hooks/useFAQs';
import Navbar from '../components/layout/navbar/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Skeleton } from '../components/ui/skeleton';

const FAQ = () => {
  const { t, language } = useLanguage();
  const { data: faqs, isLoading, error } = useFAQs();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('faq')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'الأسئلة الشائعة حول خدمات تأجير السيارات' 
                : 'Frequently asked questions about our car rental services'
              }
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">
                {language === 'ar' ? 'خطأ في تحميل الأسئلة الشائعة' : 'Error loading FAQs'}
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs?.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`item-${index}`}
                  className="bg-white rounded-lg shadow-sm border"
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <span className="font-semibold text-gray-900">
                      {language === 'ar' && faq.question_ar ? faq.question_ar : faq.question_en}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'ar' && faq.answer_ar ? faq.answer_ar : faq.answer_en}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default FAQ;
