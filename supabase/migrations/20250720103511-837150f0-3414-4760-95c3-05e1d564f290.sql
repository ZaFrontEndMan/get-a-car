
-- Create table for FAQs
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_en TEXT NOT NULL,
  question_ar TEXT,
  answer_en TEXT NOT NULL,
  answer_ar TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Terms and Conditions
CREATE TABLE public.terms_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_en TEXT NOT NULL,
  content_ar TEXT,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Privacy Policy
CREATE TABLE public.privacy_policy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_en TEXT NOT NULL,
  content_ar TEXT,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies

-- FAQs policies
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active FAQs" 
  ON public.faqs 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage FAQs" 
  ON public.faqs 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Terms and Conditions policies
ALTER TABLE public.terms_conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active terms" 
  ON public.terms_conditions 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage terms" 
  ON public.terms_conditions 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Privacy Policy policies
ALTER TABLE public.privacy_policy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active privacy policy" 
  ON public.privacy_policy 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage privacy policy" 
  ON public.privacy_policy 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Insert default content
INSERT INTO public.faqs (question_en, question_ar, answer_en, answer_ar, order_index) VALUES
('What is the minimum age to rent a car?', 'ما هو الحد الأدنى لعمر استئجار السيارة؟', 'The minimum age to rent a car is 25 years with a valid driving license.', 'الحد الأدنى لعمر استئجار السيارة هو 25 سنة مع رخصة قيادة سارية.', 1),
('Can I cancel my booking?', 'هل يمكنني إلغاء حجزي؟', 'Yes, you can cancel your booking up to 24 hours before pickup for a full refund.', 'نعم، يمكنك إلغاء حجزك حتى 24 ساعة قبل الاستلام لاسترداد كامل.', 2);

INSERT INTO public.terms_conditions (content_en, content_ar) VALUES
('Terms and Conditions

1. Rental Agreement
By renting a vehicle from GetCar, you agree to these terms and conditions.

2. Age Requirements
Minimum age: 25 years with a valid driving license.

3. Payment Terms
Full payment is required at the time of booking.

4. Cancellation Policy
Free cancellation up to 24 hours before pickup.

5. Vehicle Return
Vehicle must be returned with the same fuel level.',
'الشروط والأحكام

1. اتفاقية التأجير
بتأجير مركبة من GetCar، فإنك توافق على هذه الشروط والأحكام.

2. متطلبات العمر
الحد الأدنى للعمر: 25 سنة مع رخصة قيادة سارية.

3. شروط الدفع
الدفع الكامل مطلوب وقت الحجز.

4. سياسة الإلغاء
إلغاء مجاني حتى 24 ساعة قبل الاستلام.

5. إرجاع المركبة
يجب إرجاع المركبة بنفس مستوى الوقود.');

INSERT INTO public.privacy_policy (content_en, content_ar) VALUES
('Privacy Policy

1. Information We Collect
We collect information you provide when booking a rental.

2. How We Use Your Information
Your information is used to process bookings and provide services.

3. Data Protection
We implement security measures to protect your personal information.

4. Third-Party Services
We may use third-party services for payment processing.

5. Contact Information
For privacy concerns, contact us at privacy@getcar.sa',
'سياسة الخصوصية

1. المعلومات التي نجمعها
نجمع المعلومات التي تقدمها عند حجز التأجير.

2. كيف نستخدم معلوماتك
تُستخدم معلوماتك لمعالجة الحجوزات وتقديم الخدمات.

3. حماية البيانات
نطبق تدابير أمنية لحماية معلوماتك الشخصية.

4. خدمات الطرف الثالث
قد نستخدم خدمات طرف ثالث لمعالجة المدفوعات.

5. معلومات الاتصال
للاستفسارات حول الخصوصية، اتصل بنا على privacy@getcar.sa');
