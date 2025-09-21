import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import OfferDetailsPage from '../../offer-details/OfferDetailsPage';
import { LanguageProvider } from '../../../contexts/LanguageContext';

// Mock the data fetching hook to simulate realistic data states
vi.mock('../../../hooks/useRentalCarDetails', () => ({
  useRentalCarDetails: vi.fn(() => ({
    offer: {
      id: '123',
      title: 'Full Offer',
      discount: '10%',
      validUntil: new Date().toISOString(),
      car: {
        id: '5',
        name: 'Sedan X',
        image: '/placeholder.svg',
        rating: 4.7,
        reviews: 200,
        features: [{ key: 'ac', label: 'AC' }],
        pricing: { daily: 100, weekly: 600, monthly: 2000 },
        originalPricing: { daily: 120, weekly: 700, monthly: 2200 },
      },
      locations: ['Dubai'],
      dropoffLocations: ['Abu Dhabi'],
      policies: [{ title: 'Policy', content: 'Content' }],
      vendor: { name: 'Vendor', id: 'v1' },
    },
    loading: false,
    additionalServices: [
      { id: 'gps', name: 'GPS', description: 'Navigation', price: 10 },
    ],
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

vi.mock('../../SimilarCarsSlider', () => ({ default: () => <div data-testid="similar-cars">Similar</div> }));
vi.mock('../../OfferDetailsSidebar', () => ({ default: () => <div data-testid="sidebar">Sidebar</div> }));
vi.mock('../../OfferDetailsContent', () => ({ default: () => <div data-testid="content">Content</div> }));
vi.mock('../../OfferDetailsTerms', () => ({ default: () => <div data-testid="terms">Terms</div> }));
vi.mock('../../OfferDetailsHeader', () => ({ default: ({ offer }: any) => <div data-testid="header">{offer?.title}</div> }));
vi.mock('../../BookingForm', () => ({ default: () => <div data-testid="booking-form">Booking</div> }));
vi.mock('../../LoginModal', () => ({ default: () => <div data-testid="login-modal">Login</div> }));
vi.mock('../../offer-details/OfferVendorSection', () => ({ default: () => <div data-testid="vendor-section">Vendor</div> }));

const renderRoute = (entry: string) => {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/offers/:id" element={<OfferDetailsPage />} />
          <Route path="/cars/:id" element={<OfferDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe('OfferDetailsPage integration', () => {
  it('renders full layout for /offers/:id including header', async () => {
    renderRoute('/offers/10?carId=5');
    expect(await screen.findByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('terms')).toBeInTheDocument();
    expect(screen.getByTestId('booking-form')).toBeInTheDocument();
  });

  it('renders layout without header for /cars/:id', async () => {
    renderRoute('/cars/5');
    expect(screen.queryByTestId('header')).toBeNull();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('terms')).toBeInTheDocument();
  });
});