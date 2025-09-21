import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import OfferDetailsPage from '../../offer-details/OfferDetailsPage';
import { LanguageProvider } from '../../../contexts/LanguageContext';

// Mock hooks that fetch data to provide a minimal offer object
vi.mock('../../../hooks/useRentalCarDetails', () => ({
  useRentalCarDetails: vi.fn(() => ({
    offer: {
      id: '1',
      title: 'Test Offer',
      discount: '0%',
      validUntil: new Date().toISOString(),
      car: {
        id: '1',
        name: 'Test Car',
        image: '/placeholder.svg',
        rating: 4.5,
        reviews: 10,
        features: [],
        pricing: { daily: 100, weekly: 600, monthly: 2000 },
        originalPricing: { daily: 100, weekly: 600, monthly: 2000 },
      },
      locations: ['A'],
      dropoffLocations: ['A'],
      policies: [],
      vendor: { name: 'Vendor', id: 'v1' },
    },
    loading: false,
    additionalServices: [],
  }))
}));

// Mock the offer details state to remove dependency on AuthProvider
vi.mock('../../../hooks/useOfferDetailsState', () => ({
  useOfferDetailsState: vi.fn(() => ({
    selectedPricing: 'daily',
    setSelectedPricing: vi.fn(),
    selectedServices: [],
    setSelectedServices: vi.fn(),
    selectedPickup: null,
    setSelectedPickup: vi.fn(),
    selectedDropoff: null,
    setSelectedDropoff: vi.fn(),
    isBookingOpen: false,
    setIsBookingOpen: vi.fn(),
    isLoginOpen: false,
    setIsLoginOpen: vi.fn(),
    rentalDays: 1,
    setRentalDays: vi.fn(),
    calculateTotalPrice: vi.fn(() => ({ basePrice: 100, servicesPrice: 0, taxes: 5, totalPrice: 105 })),
    handleBookNow: vi.fn(),
    handleLoginSuccess: vi.fn(),
  }))
}));

vi.mock('../../SimilarCarsSlider', () => ({ default: () => <div data-testid="similar-cars" /> }));
vi.mock('../../OfferDetailsSidebar', () => ({ default: () => <div data-testid="sidebar" /> }));
vi.mock('../../OfferDetailsContent', () => ({ default: () => <div data-testid="content" /> }));
vi.mock('../../OfferDetailsTerms', () => ({ default: () => <div data-testid="terms" /> }));
vi.mock('../../OfferDetailsHeader', () => ({ default: ({ offer }: any) => <div data-testid="header">{offer?.title}</div> }));
vi.mock('../../BookingForm', () => ({ default: () => <div data-testid="booking-form" /> }));
vi.mock('../../LoginModal', () => ({ default: () => <div data-testid="login-modal" /> }));
vi.mock('../../offer-details/OfferVendorSection', () => ({ default: () => <div data-testid="vendor-section" /> }));

const renderWithRouter = (initialEntry: string) => {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/offers/:id" element={<OfferDetailsPage />} />
          <Route path="/cars/:id" element={<OfferDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe('OfferDetailsPage routing behavior', () => {
  it('shows header on /offers/:id route', async () => {
    renderWithRouter('/offers/10?carId=5');
    expect(await screen.findByTestId('header')).toBeInTheDocument();
  });

  it('hides header on /cars/:id route', async () => {
    renderWithRouter('/cars/5');
    expect(screen.queryByTestId('header')).toBeNull();
  });
});