
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Users, Car, Calendar, MapPin } from 'lucide-react';

const AchievementsSection = () => {
  const { t, language } = useLanguage();

  // Fetch achievements from database
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }
      
      return data || [];
    }
  });

  const getIconComponent = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      users: Users,
      car: Car,
      calendar: Calendar,
      'map-pin': MapPin
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Trophy;
    return <IconComponent className="h-8 w-8 text-primary" />;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 py-[11px]">
              {t('ourAchievements') || 'Our Achievements'}
            </h2>
            <div className="w-24 h-1 gradient-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 py-[11px]">
            {t('ourAchievements') || 'Our Achievements'}
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements?.map((achievement, index) => (
            <div
              key={achievement.id}
              className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex justify-center mb-4">
                {getIconComponent(achievement.icon)}
              </div>
              
              <h3 className="text-3xl font-bold text-primary mb-2">
                {achievement.value}
              </h3>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {language === 'ar' && achievement.title_ar ? achievement.title_ar : achievement.title}
              </h4>
              
              <p className="text-gray-600 text-sm">
                {language === 'ar' && achievement.description_ar ? achievement.description_ar : achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
