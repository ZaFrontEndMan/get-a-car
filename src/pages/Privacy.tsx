
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePrivacyPolicy } from '../hooks/usePrivacyPolicy';
import Navbar from '../components/layout/navbar/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import { Skeleton } from '../components/ui/skeleton';

const Privacy = () => {
  const { t, language } = useLanguage();
  const { data: privacy, isLoading, error } = usePrivacyPolicy();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('privacy')}
            </h1>
            <p className="text-lg text-gray-600">
              {language === 'ar' 
                ? 'سياسة الخصوصية الخاصة بخدمات تأجير السيارات' 
                : 'Privacy policy for our car rental services'
              }
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">
                {language === 'ar' ? 'خطأ في تحميل سياسة الخصوصية' : 'Error loading privacy policy'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {language === 'ar' && privacy?.content_ar ? privacy.content_ar : privacy?.content_en}
                </div>
              </div>
              
              {privacy && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    {language === 'ar' 
                      ? `الإصدار ${privacy.version} - آخر تحديث: ${new Date(privacy.updated_at).toLocaleDateString('ar-SA')}` 
                      : `Version ${privacy.version} - Last updated: ${new Date(privacy.updated_at).toLocaleDateString()}`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Privacy;
