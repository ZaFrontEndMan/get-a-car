
-- Create vendor policies table
CREATE TABLE public.vendor_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT NOT NULL,
  description_ar TEXT,
  policy_type TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.vendor_policies ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Vendor owners can manage their policies" 
  ON public.vendor_policies 
  FOR ALL 
  USING (is_vendor_owner(vendor_id, auth.uid()));

CREATE POLICY "Public can view active policies" 
  ON public.vendor_policies 
  FOR SELECT 
  USING (is_active = true);

-- Create index for better performance
CREATE INDEX idx_vendor_policies_vendor_id ON public.vendor_policies(vendor_id);
CREATE INDEX idx_vendor_policies_active ON public.vendor_policies(is_active);
