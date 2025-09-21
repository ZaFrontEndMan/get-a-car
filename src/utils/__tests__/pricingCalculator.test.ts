/**
 * Test cases for the dynamic pricing calculator
 * Demonstrates the complex daily/weekly/monthly pricing logic
 */

import { calculateBasePrice, calculateBookingPrice } from '../pricingCalculator';

// Mock pricing structure
const mockPricing = {
  daily: 100,
  weekly: 600,
  monthly: 2500
};

// Mock services
const mockServices = [
  { id: 'insurance', name: 'Insurance', price: 50, selected: true },
  { id: 'gps', name: 'GPS', price: 25, selected: false }
];

describe('Pricing Calculator', () => {
  describe('Base Price Calculation', () => {
    test('1-6 days: daily rate', () => {
      const result = calculateBasePrice(3, mockPricing);
      expect(result.price).toBe(300); // 3 * 100
      expect(result.details.calculation).toContain('3 days × 100 = 300');
    });

    test('7 days: weekly rate', () => {
      const result = calculateBasePrice(7, mockPricing);
      expect(result.price).toBe(600); // 1 * 600
      expect(result.details.calculation).toContain('1 week × 600 = 600');
    });

    test('8-13 days: weekly + daily', () => {
      const result = calculateBasePrice(10, mockPricing);
      expect(result.price).toBe(900); // 1 * 600 + 3 * 100
      expect(result.details.calculation).toContain('1 week × 600 = 600');
      expect(result.details.calculation).toContain('3 days × 100 = 300');
    });

    test('14 days: 2 weeks', () => {
      const result = calculateBasePrice(14, mockPricing);
      expect(result.price).toBe(1200); // 2 * 600
      expect(result.details.calculation).toContain('2 weeks × 600 = 1200');
    });

    test('30 days: monthly rate', () => {
      const result = calculateBasePrice(30, mockPricing);
      expect(result.price).toBe(2500); // 1 * 2500
      expect(result.details.calculation).toContain('1 month × 2500 = 2500');
    });

    test('35 days: monthly + weekly', () => {
      const result = calculateBasePrice(35, mockPricing);
      expect(result.price).toBe(3100); // 1 * 2500 + 1 * 600
      expect(result.details.calculation).toContain('1 month × 2500 = 2500');
      expect(result.details.calculation).toContain('1 week × 600 = 600');
    });

    test('37 days: monthly + weekly + daily', () => {
      const result = calculateBasePrice(37, mockPricing);
      expect(result.price).toBe(3300); // 1 * 2500 + 1 * 600 + 2 * 100
      expect(result.details.calculation).toContain('1 month × 2500 = 2500');
      expect(result.details.calculation).toContain('1 week × 600 = 600');
      expect(result.details.calculation).toContain('2 days × 100 = 200');
    });

    test('60 days: 2 months', () => {
      const result = calculateBasePrice(60, mockPricing);
      expect(result.price).toBe(5000); // 2 * 2500
      expect(result.details.calculation).toContain('2 months × 2500 = 5000');
    });

    test('65 days: 2 months + weekly', () => {
      const result = calculateBasePrice(65, mockPricing);
      expect(result.price).toBe(5600); // 2 * 2500 + 1 * 600
      expect(result.details.calculation).toContain('2 months × 2500 = 5000');
      expect(result.details.calculation).toContain('1 week × 600 = 600');
    });
  });

  describe('Complete Booking Price Calculation', () => {
    test('includes selected services', () => {
      const result = calculateBookingPrice(7, mockPricing, mockServices);
      expect(result.basePrice).toBe(600); // 1 week
      expect(result.servicesPrice).toBe(50); // Only insurance selected
      expect(result.totalPrice).toBe(650); // 600 + 50
    });

    test('no services selected', () => {
      const noServices = mockServices.map(s => ({ ...s, selected: false }));
      const result = calculateBookingPrice(7, mockPricing, noServices);
      expect(result.basePrice).toBe(600);
      expect(result.servicesPrice).toBe(0);
      expect(result.totalPrice).toBe(600);
    });
  });
});
