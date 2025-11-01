import React, { useEffect, useState } from "react";
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
  CheckCircle,
} from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import {
  ApiAboutUs,
  ApiHowToWork,
  ApiPartner,
  constantsApi,
} from "@/api/website/constantsApi";

const About: React.FC = () => {
  const { data: teamMembers, isLoading, error } = useTeamData();
  const { t } = useLanguage();
  const [aboutData, setAboutData] = useState<ApiAboutUs | null>(null);
  const [howToWorks, setHowToWorks] = useState<ApiHowToWork[]>([]);
  const [partners, setPartners] = useState<ApiPartner[]>([]);
  const [isLoading2, setIsLoading2] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch about us data
        const aboutUsData = await constantsApi.getAllAboutUs();
        const activeAbout =
          aboutUsData?.find((item) => item.isActive) || aboutUsData?.[0];
        setAboutData(activeAbout || null);

        // Fetch how to works data
        const howToWorksData = await constantsApi.getAllHowToWorks();
        setHowToWorks(howToWorksData || []);

        // Fetch partners data
        const partnersData = await constantsApi.getAllPartners();
        setPartners(partnersData || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setAboutData(null);
        setHowToWorks([]);
        setPartners([]);
      } finally {
        setIsLoading2(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || isLoading2) {
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

  if (error && !aboutData && !teamMembers) {
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("error")}
            </h3>
            <p className="text-gray-600 mb-6">{t("errorLoadingTeamData")}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {t("retry")}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AboutContent
        teamMembers={teamMembers}
        aboutData={aboutData}
        howToWorks={howToWorks}
        partners={partners}
        t={t}
      />
    </>
  );
};

const AboutContent: React.FC<{
  teamMembers: any[] | undefined;
  aboutData: ApiAboutUs | null;
  howToWorks: ApiHowToWork[];
  partners: ApiPartner[];
  t: (key: string) => string;
}> = ({ teamMembers, aboutData, howToWorks, partners, t }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {aboutData?.title || t("aboutUs")}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
              {aboutData?.description || t("aboutHeroDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {t("ourMission")}
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {t("missionDescription")}
              </p>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {t("ourVision")}
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("visionDescription")}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 flex items-center justify-center">
                {aboutData?.image ? (
                  <img
                    src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                      aboutData.image
                    }`}
                    alt={aboutData.title || "About Us"}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <img
                    src="/uploads/614c107b-eac2-4876-a794-1234caa45ab9.png"
                    alt="Mission"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      {howToWorks.length > 0 && (
        <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t("howItWorks")}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("howItWorksDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {howToWorks.map((work, index) => (
                <div
                  key={work.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        work.image
                      }`}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {work.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {work.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Partners Section */}
      {partners.length > 0 && (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  {t("ourPartners")}
                </h2>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("partnersDescription")}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                >
                  <img
                    src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                      partner.partnerLogo
                    }`}
                    alt={partner.partnerName}
                    className="w-full h-32 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
