
-- Add keywords column to blogs table for SEO
ALTER TABLE public.blogs 
ADD COLUMN keywords TEXT[];

-- Add some default blog posts with keywords
INSERT INTO public.blogs (
  title, 
  content, 
  excerpt, 
  slug, 
  status, 
  author_id, 
  keywords,
  published_at
) VALUES 
(
  'Top 10 Car Rental Tips for Saudi Arabia',
  'Planning to rent a car in Saudi Arabia? Here are the essential tips you need to know before booking your rental car. From understanding local driving laws to choosing the right insurance coverage, we''ve got you covered.',
  'Essential tips for renting a car in Saudi Arabia, including local laws, insurance, and booking advice.',
  'top-10-car-rental-tips-saudi-arabia',
  'published',
  (SELECT user_id FROM profiles WHERE role = 'admin' LIMIT 1),
  ARRAY['car rental', 'Saudi Arabia', 'driving tips', 'rental insurance', 'booking advice', 'local laws', 'travel guide', 'automotive', 'transportation', 'vacation rental'],
  NOW()
),
(
  'Best Luxury Cars for Rent in Riyadh',
  'Discover the finest luxury vehicles available for rent in Riyadh. From premium sedans to exotic sports cars, explore our comprehensive guide to luxury car rentals in the capital city.',
  'A comprehensive guide to luxury car rentals in Riyadh, featuring premium vehicles and exotic cars.',
  'best-luxury-cars-rent-riyadh',
  'published',
  (SELECT user_id FROM profiles WHERE role = 'admin' LIMIT 1),
  ARRAY['luxury cars', 'Riyadh', 'premium rental', 'exotic cars', 'sports cars', 'sedan rental', 'high-end vehicles', 'capital city', 'luxury travel', 'premium service'],
  NOW()
),
(
  'How to Choose the Right Car for Your Saudi Road Trip',
  'Planning a road trip across Saudi Arabia? Learn how to select the perfect rental car for your journey, considering factors like terrain, distance, comfort, and fuel efficiency.',
  'Guide to choosing the perfect rental car for road trips in Saudi Arabia.',
  'choose-right-car-saudi-road-trip',
  'published',
  (SELECT user_id FROM profiles WHERE role = 'admin' LIMIT 1),
  ARRAY['road trip', 'Saudi Arabia', 'car selection', 'travel planning', 'fuel efficiency', 'comfort', 'terrain', 'long distance', 'adventure travel', 'rental guide'],
  NOW()
);
