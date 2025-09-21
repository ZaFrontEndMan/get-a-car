import React from "react";
import { LanguageProvider } from "../contexts/LanguageContext";
import OfferDetailsPage from "../components/offer-details/OfferDetailsPage";

// This page now delegates to the unified OfferDetailsPage
// When accessed via /cars/:id, OfferDetailsPage hides the OfferDetailsHeader internally
const CarDetails = () => {
  return (
    <LanguageProvider>
      <OfferDetailsPage />
    </LanguageProvider>
  );
};

export default CarDetails;
