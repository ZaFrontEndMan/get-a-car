import React from "react";
import { useTeamData } from "../hooks/useTeamData";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Mail,
  Linkedin,
  Twitter,
  Users,
  MapPin,
  Globe,
  Award,
  Heart,
  Target,
  Lightbulb,
} from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
const About: React.FC = () => {
  const { data: teamMembers, isLoading, error } = useTeamData();
  const { t } = useLanguage();
  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg p-8">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('error')}</h3>
            <p className="text-gray-600 mb-6">{t('errorLoadingTeamData')}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {t('retry')}
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <AboutContent teamMembers={teamMembers} t={t} />
    </>
  );
};

// Separate component that receives translations as props to avoid useLanguage conflicts
const AboutContent: React.FC<{
  teamMembers: any[] | undefined;
  t: (key: string) => string;
}> = ({ teamMembers, t }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('aboutUs')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
              {t('aboutHeroDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {t('ourMission')}
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {t('missionDescription')}
              </p>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{t('ourVision')}</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('visionDescription')}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 flex items-center justify-center">
                <img
                  src="/uploads/614c107b-eac2-4876-a794-1234caa45ab9.png"
                  alt="Mission"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('ourValues')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('valuesDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('quality')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('qualityDescription')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('service')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('serviceDescription')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('innovation')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('innovationDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">{t('ourTeam')}</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('teamDescription')}
            </p>
          </div>

          {teamMembers && teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-1">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                            <Users className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-primary font-semibold mb-4 text-sm uppercase tracking-wide">
                        {member.position}
                      </p>
                      {member.bio && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center space-x-4 pt-6 border-t border-gray-100">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.twitter_url && (
                        <a
                          href={member.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">{t('noTeamMembersFound')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
    </div>
  );
};
export default About;
