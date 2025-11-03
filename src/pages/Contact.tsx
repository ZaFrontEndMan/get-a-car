// pages/Contact.tsx
import React, { useState } from "react";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Globe,
  MessageCircle,
} from "lucide-react";
import { useAdminSettings } from "../hooks/useAdminSettings";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Format phone number for WhatsApp
   * Removes all non-digit characters and ensures proper format
   */
  const formatPhoneForWhatsApp = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // If it starts with 0 (Saudi number format), replace with 966
    if (cleaned.startsWith("0")) {
      return "966" + cleaned.substring(1);
    }

    // If it doesn't have country code, add 966 (Saudi Arabia)
    if (!cleaned.startsWith("966") && cleaned.length === 9) {
      return "966" + cleaned;
    }

    return cleaned;
  };

  /**
   * Build WhatsApp message from form data
   */
  const buildWhatsAppMessage = (): string => {
    const lines = [
      `*${t("name")}:* ${formData.name}`,
      `*${t("emailAddress")}:* ${formData.email}`,
      formData.phone ? `*${t("phoneNumber")}:* ${formData.phone}` : "",
      `*${t("subject")}:* ${formData.subject}`,
      `*${t("message")}:*\n${formData.message}`,
    ];

    return lines.filter((line) => line).join("\n");
  };

  /**
   * Handle form submission and send to WhatsApp
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error(t("pleaseRequiredFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Get admin phone number
      const adminPhone = settings?.supportPhone;
      if (!adminPhone) {
        toast.error(t("errorWhatsAppPhoneNotFound"));
        setIsSubmitting(false);
        return;
      }

      // Format phone number
      const formattedPhone = formatPhoneForWhatsApp(adminPhone);

      // Build message
      const message = buildWhatsAppMessage();

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);

      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

      // Open WhatsApp in new window
      window.open(whatsappUrl, "_blank");

      // Show success message
      toast.success(t("redirectingToWhatsApp"));

      // Optional: Send to backend API as well
      // await axiosInstance.post("/Admin/ContactUs/Create", {
      //   name: formData.name,
      //   email: formData.email,
      //   phoneNumber: formData.phone,
      //   subject: formData.subject,
      //   description: formData.message,
      // });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      console.error("WhatsApp error:", err);
      toast.error(t("errorSendingMessage"));
    } finally {
      setIsSubmitting(false);
    }
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
                    <div className="flex items-start gap-4 rtl:gap-reverse">
                      <div className="bg-primary p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("address")}
                        </h3>
                        <p className="text-gray-600">{settings?.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rtl:gap-reverse">
                      <div className="bg-secondary p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("phone")}
                        </h3>
                        <a
                          href={`https://wa.me/${formatPhoneForWhatsApp(
                            settings?.supportPhone || ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-secondary transition-colors font-medium"
                        >
                          {settings?.supportPhone || t("defaultPhone")}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rtl:gap-reverse">
                      <div className="bg-accent p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("email")}
                        </h3>
                        <a
                          href={`mailto:${settings?.contactEmail}`}
                          className="text-gray-600 hover:text-primary transition-colors"
                        >
                          {settings?.contactEmail || t("defaultEmail")}
                        </a>
                      </div>
                    </div>

                    {settings?.website && (
                      <div className="flex items-start gap-4 rtl:gap-reverse">
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

                    <div className="flex items-start gap-4 rtl:gap-reverse">
                      <div className="bg-gold p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("businessHours")}
                        </h3>
                        <p className="text-gray-600">
                          {settings?.businessHours}
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
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("sendViaWhatsApp")}
                </h2>
              </div>

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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder={t("messageHelp")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 rtl:gap-reverse font-medium"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>
                    {isSubmitting
                      ? t("redirectingToWhatsApp")
                      : t("sendViaWhatsApp")}
                  </span>
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                {t("whatsAppDisclaimer")}
              </p>
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
