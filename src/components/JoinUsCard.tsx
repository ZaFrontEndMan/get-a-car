import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Zap, Headphones, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import VendorSignUpDialog from "./VendorSignUpDialog";

const JoinUsCard = () => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: t("growTogether"),
      description: t("reachMoreCustomers"),
    },
    {
      icon: Zap,
      title: t("easyOnboarding"),
      description: t("simpleProcess"),
    },
    {
      icon: Headphones,
      title: t("dedicatedSupport"),
      description: t("supportTeam"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden border-2 border-dashed border-primary/30 p-8 hover:border-primary/60 transition-all duration-300 h-full flex flex-col justify-between"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
      >
        {/* Header */}
        <motion.div
          className={`text-center mb-6 ${isRTL ? "text-right" : "text-left"}`}
          variants={itemVariants}
        >
          <motion.div className="inline-block mb-4">
            <Users className="h-12 w-12 text-primary" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t("joinOurNetwork")}
          </h3>
          <p className="text-gray-600">{t("expandYourBusiness")}</p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 gap-4 mb-6"
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="flex gap-3"
                variants={itemVariants}
                whileHover={{ x: isRTL ? -5 : 5 }}
              >
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 group"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{t("joinNow")}</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Sign Up Dialog */}
      <VendorSignUpDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default JoinUsCard;
