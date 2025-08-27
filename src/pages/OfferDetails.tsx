
import React from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import OfferDetailsPage from '../components/offer-details/OfferDetailsPage';

const OfferDetails = () => {
  return (
    <LanguageProvider>
      <OfferDetailsPage />
    </LanguageProvider>
  );
};

export default OfferDetails;
