import React, { useEffect, useState } from "react";
import { useTeamData } from "../hooks/useTeamData";
import { useLanguage } from "../contexts/LanguageContext";
import { Globe, Target, Lightbulb } from "lucide-react";
import {
  ApiAboutUs,
  ApiHowToWork,
  ApiPartner,
  constantsApi,
} from "@/api/website/constantsApi";
import LazyImage from "@/components/ui/LazyImage";

interface AboutSection {
  title: string;
  description: string;
  image: string;
}

const About: React.FC = () => {
  const { data: teamMembers, isLoading, error } = useTeamData();
  const { t } = useLanguage();
  const [aboutSections, setAboutSections] = useState<{
    main: ApiAboutUs | null;
    mission: AboutSection | null;
    vision: AboutSection | null;
    values: AboutSection | null;
  }>({
    main: null,
    mission: null,
    vision: null,
    values: null,
  });
  const [howToWorks, setHowToWorks] = useState<ApiHowToWork[]>([]);
  const [partners, setPartners] = useState<ApiPartner[]>([]);
  const [isLoading2, setIsLoading2] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch about us data
        const aboutUsData = await constantsApi.getAllAboutUs();

        // Separate sections by title
        let main = null;
        let mission = null;
        let vision = null;
        let values = null;

        if (aboutUsData && Array.isArray(aboutUsData)) {
          aboutUsData.forEach((item) => {
            const titleLower = item.title?.toLowerCase() || "";

            if (titleLower.includes("من نحن") || titleLower.includes("about")) {
              main = item;
            } else if (
              titleLower.includes("رسالتنا") ||
              titleLower.includes("mission")
            ) {
              mission = {
                title: item.title,
                description: item.description,
                image: item.image,
              };
            } else if (
              titleLower.includes("رؤيتنا") ||
              titleLower.includes("vision")
            ) {
              vision = {
                title: item.title,
                description: item.description,
                image: item.image,
              };
            } else if (
              titleLower.includes("القيم") ||
              titleLower.includes("values")
            ) {
              values = {
                title: item.title,
                description: item.description,
                image: item.image,
              };
            }
          });
        }

        // Fallback to first if main not found
        if (!main && aboutUsData?.[0]) {
          main = aboutUsData[0];
        }

        setAboutSections({ main, mission, vision, values });

        // Fetch how to works data
        const howToWorksData = await constantsApi.getAllHowToWorks();
        setHowToWorks(howToWorksData || []);

        // Fetch partners data
        const partnersData = await constantsApi.getAllPartners();
        setPartners(partnersData || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setAboutSections({
          main: null,
          mission: null,
          vision: null,
          values: null,
        });
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

  if (error && !aboutSections.main && !teamMembers) {
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
        aboutSections={aboutSections}
        howToWorks={howToWorks}
        partners={partners}
        t={t}
      />
    </>
  );
};

const AboutContent: React.FC<{
  teamMembers: any[] | undefined;
  aboutSections: {
    main: ApiAboutUs | null;
    mission: AboutSection | null;
    vision: AboutSection | null;
    values: AboutSection | null;
  };
  howToWorks: ApiHowToWork[];
  partners: ApiPartner[];
  t: (key: string) => string;
}> = ({ teamMembers, aboutSections, howToWorks, partners, t }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {aboutSections.main?.title || t("aboutUs")}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
              {aboutSections.main?.description || t("aboutHeroDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      {aboutSections.mission && (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center me-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {aboutSections.mission.title || t("ourMission")}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {aboutSections.mission.description || t("missionDescription")}
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 flex items-center justify-center">
                  {aboutSections.mission.image ? (
                    <LazyImage
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        aboutSections.mission.image
                      }`}
                      alt={aboutSections.mission.title}
                      className="w-full h-full rounded-2xl"
                      onLoad={() => console.log("Mission image loaded")}
                      onError={() =>
                        console.log("Mission image failed to load")
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vision Section */}
      {aboutSections.vision && (
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="aspect-square bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl p-8 flex items-center justify-center">
                  {aboutSections.vision.image ? (
                    <LazyImage
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        aboutSections.vision.image
                      }`}
                      alt={aboutSections.vision.title}
                      className="w-full h-full rounded-2xl"
                      onLoad={() => console.log("Vision image loaded")}
                      onError={() => console.log("Vision image failed to load")}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center me-4">
                    <Lightbulb className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {aboutSections.vision.title || t("ourVision")}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {aboutSections.vision.description || t("visionDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Values Section */}
      {aboutSections.values && (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center me-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  {aboutSections.values.title || t("ourValues")}
                </h2>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {aboutSections.values.description || t("valuesDescription")}
              </p>
            </div>
            {aboutSections.values.image && (
              <div className="max-w-4xl mx-auto">
                <LazyImage
                  src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                    aboutSections.values.image
                  }`}
                  alt={aboutSections.values.title}
                  className="w-full h-96 md:h-[500px] object-cover rounded-2xl mx-auto"
                  onLoad={() => console.log("Values image loaded")}
                  onError={() => console.log("Values image failed to load")}
                />
              </div>
            )}
          </div>
        </div>
      )}

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
                    {work.image ? (
                      <>
                        <LazyImage
                          src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                            work.image
                          }`}
                          alt={work.title}
                          className="w-full h-full object-cover"
                          onLoad={() =>
                            console.log(`How to work ${work.id} image loaded`)
                          }
                          onError={() =>
                            console.log(
                              `How to work ${work.id} image failed to load`
                            )
                          }
                        />
                        <div className="absolute top-4 right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="absolute top-4 right-4 w-12 h-12 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                    )}
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
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center me-4">
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
                  {partner.partnerLogo ? (
                    <LazyImage
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        partner.partnerLogo
                      }`}
                      alt={partner.partnerName}
                      className="w-full h-32 object-contain"
                      onLoad={() =>
                        console.log(
                          `Partner ${partner.partnerName} logo loaded`
                        )
                      }
                      onError={() =>
                        console.log(
                          `Partner ${partner.partnerName} logo failed to load`
                        )
                      }
                    />
                  ) : (
                    <div className="w-full h-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-medium">
                        {partner.partnerName || t("partner")}
                      </span>
                    </div>
                  )}
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
