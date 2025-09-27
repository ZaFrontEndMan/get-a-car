import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
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

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white hidden md:block">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center animate-pulse">
          <div className="h-8 bg-gray-800 rounded mx-auto w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded mx-auto w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded mx-auto w-1/4"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white hidden md:block">
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-2">
        {/* Logo + Name */}
        <div className=" flex flex-col items-start">
          <div className="flex justify-center items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">
              {settings?.siteName || "GetCar Rental"}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm max-w-2xl mx-auto">
            {settings?.siteDescription ||
              "Your trusted partner for premium car rental services across Saudi Arabia."}
          </p>
        </div>

        {/* Social Icons */}

        {/* Contact Info */}
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-center items-center space-x-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>{settings?.supportPhone || "+966 11 123 4567"}</span>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <Mail className="h-4 w-4 text-primary" />
            <span>{settings?.contactEmail || "info@getcar.sa"}</span>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>
              {settings?.address || "King Fahd Road, Riyadh, Saudi Arabia"}
            </span>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-gray-400 text-xs border-t border-gray-800 pt-6">
          © {new Date().getFullYear()} {settings?.siteName || "GetCar"}.{" "}
          {t("allRightsReserved") || "All rights reserved."}
        </p>
        <div className="flex justify-center space-x-4">
          {getSocialIcons().map((social) => {
            const IconComponent = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                className="text-gray-300 hover:text-primary transition-colors p-2"
                aria-label={social.name}
                target={social.href !== "#" ? "_blank" : "_self"}
                rel={social.href !== "#" ? "noopener noreferrer" : undefined}
              >
                <IconComponent className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
