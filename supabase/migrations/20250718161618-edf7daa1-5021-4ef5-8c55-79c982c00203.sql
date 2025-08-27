
-- Create achievements table
CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  title_ar text,
  description text NOT NULL,
  description_ar text,
  icon text,
  value text NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  name_ar text,
  location text,
  location_ar text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  comment_ar text,
  avatar_url text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for achievements
CREATE POLICY "Public can view active achievements" 
  ON public.achievements 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage achievements" 
  ON public.achievements 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Enable RLS for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for testimonials
CREATE POLICY "Public can view active testimonials" 
  ON public.testimonials 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" 
  ON public.testimonials 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Insert sample achievements data
INSERT INTO public.achievements (title, title_ar, description, description_ar, icon, value, order_index) VALUES
('Happy Customers', 'عملاء سعداء', 'Satisfied customers who trust our service', 'عملاء راضون يثقون في خدمتنا', 'users', '50,000+', 1),
('Cars Available', 'السيارات المتاحة', 'Wide selection of premium vehicles', 'مجموعة واسعة من المركبات المميزة', 'car', '2,500+', 2),
('Years Experience', 'سنوات الخبرة', 'Proven track record in car rental industry', 'سجل حافل في صناعة تأجير السيارات', 'calendar', '15+', 3),
('Cities Covered', 'المدن المغطاة', 'Service available across major cities', 'الخدمة متاحة في المدن الرئيسية', 'map-pin', '25+', 4);

-- Insert sample testimonials data
INSERT INTO public.testimonials (name, name_ar, location, location_ar, rating, comment, comment_ar, avatar_url, is_featured, order_index) VALUES
('Ahmed Al-Mansouri', 'أحمد المنصوري', 'Riyadh', 'الرياض', 5, 'Excellent service! The car was clean and the booking process was seamless. Highly recommended!', 'خدمة ممتازة! كانت السيارة نظيفة وعملية الحجز سهلة. أنصح بشدة!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', true, 1),
('Sarah Johnson', 'سارة جونسون', 'Jeddah', 'جدة', 5, 'Amazing experience with Get Car. Professional staff and great vehicle selection.', 'تجربة رائعة مع جت كار. طاقم محترف ومجموعة رائعة من المركبات.', 'https://images.unsplash.com/photo-1494790108755-2616b332b5bb?w=100&h=100&fit=crop&crop=face', true, 2),
('Mohammed Al-Rashid', 'محمد الراشد', 'Dammam', 'الدمام', 4, 'Good value for money. The car was in perfect condition and pickup was convenient.', 'قيمة جيدة مقابل المال. كانت السيارة في حالة ممتازة والاستلام كان مريحًا.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', true, 3),
('Emma Wilson', 'إيما ويلسون', 'Al Khobar', 'الخبر', 5, 'Fantastic service! The team went above and beyond to ensure a smooth rental experience.', 'خدمة رائعة! فريق العمل بذل جهدًا إضافيًا لضمان تجربة تأجير سلسة.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', true, 4);
