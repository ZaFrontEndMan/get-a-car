import React from "react";
import { User, Building } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface UserTypeSwitcherProps {
  userType: "client" | "vendor";
  onUserTypeChange: (type: "client" | "vendor") => void;
}

const UserTypeSwitcher = ({
  userType,
  onUserTypeChange,
}: UserTypeSwitcherProps) => {
  const { t } = useLanguage();

  const userTypes = [
    { key: "client" as const, icon: User, label: t("client") },
    { key: "vendor" as const, icon: Building, label: t("vendor") },
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      {userTypes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onUserTypeChange(key)}
          className={`flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse py-2 px-4 rounded-md font-medium transition-all duration-300 ${
            userType === key
              ? "bg-primary text-white shadow-md"
              : "text-gray-600 hover:text-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{t(`${label}`)}</span>
        </button>
      ))}
    </div>
  );
};

export default UserTypeSwitcher;
