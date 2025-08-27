-- Create hero_slides table for managing slider content
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  subtitle TEXT NOT NULL,
  subtitle_ar TEXT,
  image_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  button_text TEXT,
  button_text_ar TEXT,
  button_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active hero slides" 
ON public.hero_slides 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage hero slides" 
ON public.hero_slides 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Insert some default slides
INSERT INTO public.hero_slides (title, title_ar, subtitle, subtitle_ar, image_url, button_text, button_text_ar, button_url, order_index) VALUES
('Premium Car Rental', 'تأجير السيارات المميز', 'Experience luxury and comfort with our premium fleet', 'اختبر الفخامة والراحة مع أسطولنا المميز', '/uploads/019e4079-36bc-4104-b9ba-0f4e0ea897a6.png', 'Book Now', 'احجز الآن', '/cars', 1),
('Best Deals Available', 'أفضل العروض المتاحة', 'Find amazing deals on top-rated vehicles', 'اعثر على عروض مذهلة على المركبات الأعلى تقييماً', '/uploads/035415fe-c520-495d-9eed-a57977e24db2.png', 'View Offers', 'عرض العروض', '/offers', 2),
('Trusted by Thousands', 'موثوق من الآلاف', 'Join thousands of satisfied customers', 'انضم إلى آلاف العملاء الراضين', '/uploads/10b7fec1-615a-4b01-ae08-d35764ce917a.png', 'Learn More', 'اعرف المزيد', '/about', 3);