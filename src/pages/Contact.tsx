import React, { useState } from "react";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import { MapPin, Phone, Mail, Clock, Send, Globe } from "lucide-react";
import { useAdminSettings } from "../hooks/useAdminSettings";

const ContactContent = () => {
  const { t } = useLanguage();
  const { data: settings, isLoading } = useAdminSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission here
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("contactUs")}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("contactDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("getInTouch")}
                </h2>

                {isLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="bg-primary p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("address")}
                        </h3>
                        <p className="text-gray-600">
                          {settings?.address || t("defaultAddress")}
                        </p>
                        <p className="text-gray-600">
                          {settings?.city}, {settings?.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="bg-secondary p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("phone")}
                        </h3>
                        <p className="text-gray-600">
                          {settings?.supportPhone || t("defaultPhone")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="bg-accent p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("email")}
                        </h3>
                        <p className="text-gray-600">
                          {settings?.contactEmail || t("defaultEmail")}
                        </p>
                      </div>
                    </div>

                    {settings?.website && (
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <div className="bg-blue-600 p-3 rounded-lg">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {t("websiteLabel")}
                          </h3>
                          <a
                            href={settings.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary transition-colors"
                          >
                            {settings.website}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="bg-gold p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("businessHours")}
                        </h3>
                        <p className="text-gray-600">
                          {t("sundayThursdayHours")}
                        </p>
                        <p className="text-gray-600">
                          {t("fridaySaturdayHours")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Map */}
              <div className="rounded-lg h-64 overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.4!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("interactiveMap")}
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("sendMessage")}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("fullName")} {t("required")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t("yourFullName")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("emailAddress")} {t("required")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t("yourEmail")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("phoneNumber")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t("phoneFormat")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("subject")} {t("required")}
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{t("selectSubject")}</option>
                      <option value="booking">{t("bookingInquiry")}</option>
                      <option value="support">{t("customerSupport")}</option>
                      <option value="partnership">{t("partnership")}</option>
                      <option value="feedback">{t("feedback")}</option>
                      <option value="other">{t("other")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("message")} {t("required")}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t("messageHelp")}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Send className="h-5 w-5" />
                  <span>{t("sendMessage")}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <LanguageProvider>
      <ContactContent />
    </LanguageProvider>
  );
};

export default Contact;
