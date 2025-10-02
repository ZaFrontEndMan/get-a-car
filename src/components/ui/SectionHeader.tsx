import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  showViewAll?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  viewAllLink,
  showViewAll = true,
  className = ''
}) => {
  const { t, language } = useLanguage();

  return (
    <div className={`flex justify-between items-center mb-16 ${className}`}>
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 py-[13px]">
          {title}
        </h2>
        <div className="w-24 h-1 gradient-primary rounded-full"></div>
      </div>
      {showViewAll && viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <span>{t("viewAll")}</span>
          {language === "ar" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;