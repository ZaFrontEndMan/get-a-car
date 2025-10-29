import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import {
  Car,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Music,
  Youtube,
  Linkedin,
} from "lucide-react";
import { useAdminSettings } from "../hooks/useAdminSettings";

const Footer = () => {
  const { t } = useLanguage();
  const { data: settings, isLoading } = useAdminSettings();

  const getSocialIcons = () => {
    const icons = [];

    if (settings?.facebookUrl) {
      icons.push({
        name: "Facebook",
        icon: Facebook,
        href: settings.facebookUrl,
      });
    }
    if (settings?.instagramUrl) {
      icons.push({
        name: "Instagram",
        icon: Instagram,
        href: settings.instagramUrl,
      });
    }
    if (settings?.twitterUrl) {
      icons.push({ name: "X", icon: Twitter, href: settings.twitterUrl });
    }
    if (settings?.linkedinUrl) {
      icons.push({
        name: "LinkedIn",
        icon: Linkedin,
        href: settings.linkedinUrl,
      });
    }
    if (settings?.youtubeUrl) {
      icons.push({ name: "YouTube", icon: Youtube, href: settings.youtubeUrl });
    }

    // fallback
    if (icons.length === 0) {
      return [
        { name: "Facebook", icon: Facebook, href: "#" },
        { name: "Instagram", icon: Instagram, href: "#" },
        { name: "X", icon: Twitter, href: "#" },
        { name: "TikTok", icon: Music, href: "#" },
      ];
    }

    return icons;
  };

  const quickLinks = [
    { label: t("home"), path: "/" },
    { label: t("cars"), path: "/cars" },
    { label: t("offers"), path: "/offers" },
    { label: t("blog"), path: "/blog" },
    { label: t("contact"), path: "/contact" },
  ];

  const usefulLinks = [
    { label: t("faq"), path: "/faq" },
    { label: t("termsOfService"), path: "/terms" },
    { label: t("privacyPolicy"), path: "/privacy" },
  ];

  if (isLoading) {
    return (
      <footer className="bg-[#1a1f2e] text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#1a1f2e] text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">
                {settings?.siteName || "GetCar Rental"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings?.siteDescription || t("premiumCarRentalService")}
            </p>
            <div className="flex gap-3 pt-2">
              {getSocialIcons().map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                    aria-label={social.name}
                    target={social.href !== "#" ? "_blank" : "_self"}
                    rel={
                      social.href !== "#" ? "noopener noreferrer" : undefined
                    }
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("usefulLinks")}</h4>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("contactInfo")}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  {settings?.supportPhone || "+201007419344"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  {settings?.contactEmail || "info@getcar.sa"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  {settings?.address ||
                    "26 King Fahd Road, Riyadh, Saudi Arabia"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {settings?.siteName || "GetCar Rental"}
            . {t("allRightsReserved")}
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t("termsOfService")}
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t("privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
